from sqlalchemy.orm import Session
from datetime import datetime, date
from typing import List
from app.models import Teacher, Batch, Attendance, StudyMaterial, Test, TestResult, Student
from app.schemas.teacher import *


class TeacherService:
    """
    Teacher Service - Implements strict data isolation
    
    SECURITY POLICY:
    - All methods automatically filter data by teacher_id
    - Teachers can ONLY access their own batches, students, tests, and materials
    - Authorization checks prevent access to other teachers' data
    - No fee-related functionality exposed to teachers
    - Test results filtered: teachers only see marks from their own tests
    - Modification of test marks: only allowed for teacher's own tests
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_dashboard(self, user_id: int) -> dict:
        """Get teacher dashboard data"""
        teacher = self.db.query(Teacher).filter(Teacher.user_id == user_id).first()
        if not teacher:
            raise ValueError("Teacher profile not found")
        
        total_batches = self.db.query(Batch).filter(Batch.teacher_id == teacher.id).count()
        total_students = sum([len(batch.students) for batch in teacher.batches])
        total_materials = self.db.query(StudyMaterial).filter(StudyMaterial.teacher_id == teacher.id).count()
        total_tests = self.db.query(Test).filter(Test.teacher_id == teacher.id).count()
        
        return {
            "teacher_id": teacher.id,
            "name": teacher.user.full_name,
            "email": teacher.user.email,
            "subject": teacher.subject,
            "qualification": teacher.qualification,
            "experience": teacher.experience,
            "total_batches": total_batches,
            "total_students": total_students,
            "total_materials": total_materials,
            "total_tests": total_tests
        }
    
    def get_teacher_batches(self, user_id: int) -> List[dict]:
        """Get teacher's assigned batches with students"""
        teacher = self.db.query(Teacher).filter(Teacher.user_id == user_id).first()
        if not teacher:
            raise ValueError("Teacher profile not found")
        
        batches = self.db.query(Batch).filter(Batch.teacher_id == teacher.id).all()
        
        result = []
        for batch in batches:
            result.append({
                "id": batch.id,
                "name": batch.name,
                "code": batch.code,
                "timing": batch.timing,
                "days": batch.days,
                "course_id": batch.course_id,
                "students": [
                    {
                        "id": student.id,
                        "name": student.user.full_name if student.user else "Unknown",
                        "user": {
                            "id": student.user.id,
                            "full_name": student.user.full_name,
                            "email": student.user.email
                        } if student.user else None
                    }
                    for student in batch.students
                ]
            })
        
        return result
    
    def mark_attendance(self, user_id: int, attendance_data: AttendanceCreate) -> List[Attendance]:
        """Mark attendance for students"""
        teacher = self.db.query(Teacher).filter(Teacher.user_id == user_id).first()
        if not teacher:
            raise ValueError("Teacher profile not found")
        
        batch = self.db.query(Batch).filter(Batch.id == attendance_data.batch_id).first()
        if not batch or batch.teacher_id != teacher.id:
            raise ValueError("Unauthorized to mark attendance for this batch")
        
        attendance_records = []
        for record in attendance_data.records:
            attendance = Attendance(
                student_id=record.student_id,
                batch_id=attendance_data.batch_id,
                date=attendance_data.date,
                is_present=record.is_present,
                remarks=record.remarks,
                marked_by=teacher.user_id
            )
            self.db.add(attendance)
            attendance_records.append(attendance)
        
        self.db.commit()
        
        # Refresh all records to get database values
        for attendance in attendance_records:
            self.db.refresh(attendance)
        
        return attendance_records
    
    def get_batch_attendance(self, batch_id: int) -> List[Attendance]:
        """Get attendance for a specific batch"""
        return self.db.query(Attendance).filter(Attendance.batch_id == batch_id).all()
    
    def create_study_material(self, user_id: int, material_data: StudyMaterialCreate) -> StudyMaterial:
        """Upload study material"""
        teacher = self.db.query(Teacher).filter(Teacher.user_id == user_id).first()
        if not teacher:
            raise ValueError("Teacher profile not found")
        
        material = StudyMaterial(
            title=material_data.title,
            description=material_data.description,
            file_url=material_data.file_url,
            file_type=material_data.file_type,
            file_size=material_data.file_size,
            course_id=material_data.course_id,
            teacher_id=teacher.id,
            is_public=material_data.is_public
        )
        
        self.db.add(material)
        self.db.commit()
        self.db.refresh(material)
        
        return material
    
    def get_teacher_study_materials(self, user_id: int) -> List[StudyMaterial]:
        """Get teacher's uploaded study materials"""
        teacher = self.db.query(Teacher).filter(Teacher.user_id == user_id).first()
        if not teacher:
            raise ValueError("Teacher profile not found")
        
        return self.db.query(StudyMaterial).filter(StudyMaterial.teacher_id == teacher.id).all()
    
    def create_test(self, user_id: int, test_data: TestCreate) -> Test:
        """Create a new test"""
        teacher = self.db.query(Teacher).filter(Teacher.user_id == user_id).first()
        if not teacher:
            raise ValueError("Teacher profile not found")
        
        test = Test(
            title=test_data.title,
            description=test_data.description,
            course_id=test_data.course_id,
            teacher_id=teacher.id,
            total_marks=test_data.total_marks,
            passing_marks=test_data.passing_marks,
            duration_minutes=test_data.duration_minutes,
            test_date=test_data.test_date
        )
        
        self.db.add(test)
        self.db.commit()
        self.db.refresh(test)
        
        return test
    
    def get_teacher_tests(self, user_id: int) -> List[dict]:
        """Get teacher's created tests with course info"""
        teacher = self.db.query(Teacher).filter(Teacher.user_id == user_id).first()
        if not teacher:
            raise ValueError("Teacher profile not found")
        
        tests = self.db.query(Test).filter(Test.teacher_id == teacher.id).all()
        
        result = []
        for test in tests:
            result.append({
                "id": test.id,
                "title": test.title,
                "description": test.description,
                "course_id": test.course_id,
                "total_marks": test.total_marks,
                "passing_marks": test.passing_marks,
                "duration_minutes": test.duration_minutes,
                "test_date": test.test_date.isoformat() if test.test_date else None,
                "is_published": test.is_published,
                "created_at": test.created_at.isoformat() if test.created_at else None
            })
        
        return result
    
    def upload_test_results(self, user_id: int, test_id: int, results_data: List) -> List[TestResult]:
        """Upload test results for multiple students"""
        teacher = self.db.query(Teacher).filter(Teacher.user_id == user_id).first()
        if not teacher:
            raise ValueError("Teacher profile not found")
        
        test = self.db.query(Test).filter(Test.id == test_id).first()
        if not test or test.teacher_id != teacher.id:
            raise ValueError("Test not found or unauthorized")
        
        results = []
        for result_data in results_data:
            # Check if result already exists
            existing_result = self.db.query(TestResult).filter(
                TestResult.test_id == test_id,
                TestResult.student_id == result_data.student_id
            ).first()
            
            if existing_result:
                # Update existing result
                existing_result.marks_obtained = result_data.marks_obtained
                existing_result.percentage = int((result_data.marks_obtained / test.total_marks) * 100)
                existing_result.remarks = result_data.remarks
                existing_result.evaluated_at = datetime.now()
                results.append(existing_result)
            else:
                # Create new result
                new_result = TestResult(
                    test_id=test_id,
                    student_id=result_data.student_id,
                    marks_obtained=result_data.marks_obtained,
                    percentage=int((result_data.marks_obtained / test.total_marks) * 100),
                    remarks=result_data.remarks,
                    evaluated_at=datetime.now()
                )
                self.db.add(new_result)
                results.append(new_result)
        
        self.db.commit()
        
        for result in results:
            self.db.refresh(result)
        
        return results
    
    def evaluate_test(self, user_id: int, test_id: int, evaluation: TestEvaluation) -> TestResult:
        """Evaluate a student's test (ONLY for tests created by this teacher)"""
        teacher = self.db.query(Teacher).filter(Teacher.user_id == user_id).first()
        if not teacher:
            raise ValueError("Teacher profile not found")
        
        # Verify test ownership
        test = self.db.query(Test).filter(Test.id == test_id).first()
        if not test or test.teacher_id != teacher.id:
            raise ValueError("Test not found or unauthorized - You can only modify your own test results")
        
        result = self.db.query(TestResult).filter(
            TestResult.test_id == test_id,
            TestResult.student_id == evaluation.student_id
        ).first()
        
        if not result:
            raise ValueError("Test result not found")
        
        # Update evaluation
        result.marks_obtained = evaluation.marks_obtained
        result.remarks = evaluation.remarks
        result.evaluated_at = datetime.utcnow()
        
        # Recalculate percentage
        result.percentage = int((evaluation.marks_obtained / test.total_marks) * 100)
        
        self.db.commit()
        self.db.refresh(result)
        
        return result
    
    def get_student_performance(self, user_id: int, student_id: int) -> dict:
        """Get performance report for a specific student (ONLY showing this teacher's test results)"""
        teacher = self.db.query(Teacher).filter(Teacher.user_id == user_id).first()
        if not teacher:
            raise ValueError("Teacher profile not found")
        
        student = self.db.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise ValueError("Student not found")
        
        # Verify student is in one of teacher's batches
        teacher_batch_ids = [batch.id for batch in teacher.batches]
        student_in_teacher_batch = any(batch.id in teacher_batch_ids for batch in student.batches)
        
        if not student_in_teacher_batch:
            raise ValueError("Unauthorized - Student not in your batches")
        
        # Attendance (only from teacher's batches)
        total_attendance = self.db.query(Attendance).filter(
            Attendance.student_id == student_id,
            Attendance.batch_id.in_(teacher_batch_ids)
        ).count()
        present_count = self.db.query(Attendance).filter(
            Attendance.student_id == student_id,
            Attendance.batch_id.in_(teacher_batch_ids),
            Attendance.is_present == True
        ).count()
        
        attendance_percentage = (present_count / total_attendance * 100) if total_attendance > 0 else 0
        
        # Test results - ONLY from tests created by THIS teacher
        test_results = self.db.query(TestResult).join(Test).filter(
            TestResult.student_id == student_id,
            Test.teacher_id == teacher.id
        ).all()
        total_tests = len(test_results)
        average_marks = sum([r.percentage for r in test_results]) / total_tests if total_tests > 0 else 0
        
        return {
            "student_id": student_id,
            "student_name": student.user.full_name,
            "attendance_percentage": attendance_percentage,
            "total_tests": total_tests,
            "average_marks": average_marks,
            "test_results": test_results
        }
