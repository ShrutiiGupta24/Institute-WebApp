from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.models import Student, Attendance, Fee, Test, TestResult, StudyMaterial, Course
from app.schemas.student import TestSubmission


class StudentService:
    """
    Student Service with strict data isolation
    
    SECURITY POLICY:
    - All methods require user_id from JWT token (not student_id from URL)
    - Students can ONLY access their own data
    - All queries filter by user_id -> student_id automatically
    - No access to other students' information (attendance, fees, tests, etc.)
    - Authorization enforced at route level with require_role(UserRole.STUDENT)
    - Data access enforced at service level by querying with user_id
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_dashboard(self, user_id: int) -> dict:
        """Get student dashboard data - ONLY for authenticated student's own data"""
        student = self.db.query(Student).filter(Student.user_id == user_id).first()
        if not student:
            raise ValueError("Student profile not found")
        
        # Get statistics - all filtered by student.id (derived from user_id)
        total_attendance = self.db.query(Attendance).filter(Attendance.student_id == student.id).count()
        present_count = self.db.query(Attendance).filter(
            Attendance.student_id == student.id,
            Attendance.is_present == True
        ).count()
        
        attendance_percentage = (present_count / total_attendance * 100) if total_attendance > 0 else 0
        
        # Fee status
        pending_fees = self.db.query(Fee).filter(
            Fee.student_id == student.id,
            Fee.status != "paid"
        ).count()
        
        # Test results
        total_tests = self.db.query(TestResult).filter(TestResult.student_id == student.id).count()
        
        return {
            "student_id": student.id,
            "name": student.user.full_name,
            "email": student.user.email,
            "course": student.course,
            "batch": student.batch,
            "attendance_percentage": round(attendance_percentage, 2),
            "pending_fees": pending_fees,
            "total_tests": total_tests
        }
    
    def get_student_attendance(self, user_id: int) -> dict:
        """Get student's attendance records - ONLY for authenticated student"""
        student = self.db.query(Student).filter(Student.user_id == user_id).first()
        if not student:
            raise ValueError("Student profile not found")
        
        # Get all attendance records
        attendance_records = self.db.query(Attendance).filter(Attendance.student_id == student.id).all()
        
        # Group by batch/subject
        batch_attendance = {}
        for record in attendance_records:
            batch_name = record.batch.name if record.batch else "Unknown"
            if batch_name not in batch_attendance:
                batch_attendance[batch_name] = {
                    "total": 0,
                    "present": 0
                }
            batch_attendance[batch_name]["total"] += 1
            if record.is_present:
                batch_attendance[batch_name]["present"] += 1
        
        # Format response
        attendance_summary = []
        for batch_name, stats in batch_attendance.items():
            percentage = (stats["present"] / stats["total"] * 100) if stats["total"] > 0 else 0
            status = "Excellent" if percentage >= 90 else "Good" if percentage >= 75 else "Average"
            
            attendance_summary.append({
                "subject": batch_name,
                "totalClasses": stats["total"],
                "attended": stats["present"],
                "percentage": round(percentage, 2),
                "status": status
            })
        
        # Calculate overall stats
        total_classes = sum(s["totalClasses"] for s in attendance_summary)
        total_attended = sum(s["attended"] for s in attendance_summary)
        overall_percentage = (total_attended / total_classes * 100) if total_classes > 0 else 0
        
        return {
            "attendance": attendance_summary,
            "overall": {
                "totalClasses": total_classes,
                "totalAttended": total_attended,
                "percentage": round(overall_percentage, 2)
            }
        }
    
    def get_student_fees(self, user_id: int) -> dict:
        """Get student's fee records with summary"""
        student = self.db.query(Student).filter(Student.user_id == user_id).first()
        if not student:
            raise ValueError("Student profile not found")
        
        fees = self.db.query(Fee).filter(Fee.student_id == student.id).order_by(Fee.due_date.desc()).all()
        
        # Calculate totals
        total_fees = sum(f.amount for f in fees)
        total_paid = sum(f.paid_amount for f in fees)
        total_pending = total_fees - total_paid
        
        # Format fee records
        fee_records = []
        for fee in fees:
            fee_records.append({
                "id": fee.id,
                "amount": fee.amount,
                "paidAmount": fee.paid_amount,
                "pendingAmount": fee.amount - fee.paid_amount,
                "dueDate": fee.due_date.strftime("%Y-%m-%d") if fee.due_date else "N/A",
                "paymentDate": fee.payment_date.strftime("%Y-%m-%d") if fee.payment_date else None,
                "status": fee.status.value if hasattr(fee.status, 'value') else fee.status,
                "paymentMethod": fee.payment_method.value if fee.payment_method and hasattr(fee.payment_method, 'value') else fee.payment_method,
                "transactionId": fee.transaction_id,
                "remarks": fee.remarks,
                "receiptUrl": fee.receipt_url
            })
        
        return {
            "fees": fee_records,
            "summary": {
                "totalFees": total_fees,
                "totalPaid": total_paid,
                "totalPending": total_pending,
                "paidPercentage": round((total_paid / total_fees * 100) if total_fees > 0 else 0, 1)
            }
        }
    
    def get_student_tests(self, user_id: int) -> dict:
        """Get student's test results grouped by subject"""
        student = self.db.query(Student).filter(Student.user_id == user_id).first()
        if not student:
            raise ValueError("Student profile not found")
        
        # Get student's batches and course IDs
        student_batches = student.batches if hasattr(student, 'batches') else []
        course_ids = [b.course_id for b in student_batches if b.course_id]
        
        if not course_ids:
            return {"subjects": []}
        
        # Get all test results for this student with enrolled courses
        results = self.db.query(TestResult).join(Test).filter(
            TestResult.student_id == student.id,
            Test.course_id.in_(course_ids)
        ).all()
        
        # Group by subject/course
        grouped_results = {}
        for result in results:
            test = result.test
            course = self.db.query(Course).filter(Course.id == test.course_id).first()
            subject_name = course.name if course else "General"
            
            if subject_name not in grouped_results:
                grouped_results[subject_name] = {
                    "color": course.color if course and hasattr(course, 'color') else "#667eea",
                    "tests": []
                }
            
            # Calculate grade based on percentage
            percentage = result.percentage if result.percentage else (
                (result.marks_obtained / test.total_marks * 100) if test.total_marks else 0
            )
            
            if percentage >= 90:
                grade = "A+"
            elif percentage >= 80:
                grade = "A"
            elif percentage >= 70:
                grade = "B+"
            elif percentage >= 60:
                grade = "B"
            elif percentage >= 50:
                grade = "C"
            else:
                grade = "F"
            
            grouped_results[subject_name]["tests"].append({
                "id": result.id,
                "testName": test.title,
                "date": test.test_date.strftime("%Y-%m-%d") if test.test_date else "N/A",
                "marksObtained": result.marks_obtained,
                "totalMarks": test.total_marks,
                "percentage": round(percentage, 1),
                "grade": grade,
                "uploadedBy": test.teacher.user.full_name if test.teacher and test.teacher.user else "Admin",
                "uploadDate": result.evaluated_at.strftime("%Y-%m-%d") if result.evaluated_at else 
                             (result.created_at.strftime("%Y-%m-%d") if result.created_at else "N/A")
            })
        
        # Convert to array format
        subjects = []
        colors = ["#667eea", "#764ba2", "#f59e0b", "#10b981", "#06b6d4", "#8b5cf6"]
        for idx, (subject_name, data) in enumerate(grouped_results.items()):
            subjects.append({
                "id": idx + 1,
                "name": subject_name,
                "color": data["color"] if data["color"] != "#667eea" else colors[idx % len(colors)],
                "tests": sorted(data["tests"], key=lambda x: x["date"])
            })
        
        return {"subjects": subjects}
    
    def get_study_materials(self, user_id: int) -> dict:
        """Get available study materials grouped by subject"""
        student = self.db.query(Student).filter(Student.user_id == user_id).first()
        if not student:
            raise ValueError("Student profile not found")
        
        # Get student's batches
        student_batches = student.batches if hasattr(student, 'batches') else []
        
        # Get course IDs from student's enrolled batches
        course_ids = [b.course_id for b in student_batches if b.course_id]
        
        # Only get materials from enrolled courses
        if not course_ids:
            return {"subjects": []}
        
        materials = self.db.query(StudyMaterial).filter(
            StudyMaterial.course_id.in_(course_ids)
        ).all()
        
        # Group by subject/course
        grouped_materials = {}
        for material in materials:
            # Determine subject name
            if material.course_id:
                course = self.db.query(Course).filter(Course.id == material.course_id).first()
                subject_name = course.name if course else "General"
            else:
                subject_name = "General"
            
            if subject_name not in grouped_materials:
                grouped_materials[subject_name] = []
            
            # Format file size
            file_size_mb = (material.file_size / (1024 * 1024)) if material.file_size else 0
            
            grouped_materials[subject_name].append({
                "id": material.id,
                "title": material.title,
                "description": material.description,
                "type": material.file_type or "PDF",
                "size": f"{file_size_mb:.1f} MB",
                "uploadDate": material.created_at.strftime("%Y-%m-%d") if material.created_at else "N/A",
                "file_url": material.file_url,
                "teacher": material.teacher.user.full_name if material.teacher else "Admin"
            })
        
        # Convert to array format
        subjects = []
        colors = ["#667eea", "#764ba2", "#f59e0b", "#10b981", "#06b6d4", "#8b5cf6"]
        for idx, (subject_name, materials_list) in enumerate(grouped_materials.items()):
            subjects.append({
                "id": idx + 1,
                "name": subject_name,
                "color": colors[idx % len(colors)],
                "materials": materials_list
            })
        
        return {"subjects": subjects}
    
    def submit_test(self, user_id: int, test_id: int, submission: TestSubmission) -> TestResult:
        """Submit a test"""
        student = self.db.query(Student).filter(Student.user_id == user_id).first()
        if not student:
            raise ValueError("Student profile not found")
        
        test = self.db.query(Test).filter(Test.id == test_id).first()
        if not test:
            raise ValueError("Test not found")
        
        # Check if already submitted
        existing_result = self.db.query(TestResult).filter(
            TestResult.test_id == test_id,
            TestResult.student_id == student.id
        ).first()
        
        if existing_result:
            raise ValueError("Test already submitted")
        
        # Calculate percentage
        percentage = (submission.marks_obtained / test.total_marks) * 100
        
        # Create test result
        result = TestResult(
            test_id=test_id,
            student_id=student.id,
            marks_obtained=submission.marks_obtained,
            percentage=int(percentage),
            remarks=submission.remarks,
            submitted_at=datetime.utcnow()
        )
        
        self.db.add(result)
        self.db.commit()
        self.db.refresh(result)
        
        return result
    
    def get_student_batches(self, user_id: int) -> List:
        """Get student's enrolled batches"""
        student = self.db.query(Student).filter(Student.user_id == user_id).first()
        if not student:
            raise ValueError("Student profile not found")
        
        return student.batches
    
    def get_available_tests(self, user_id: int) -> dict:
        """Get available tests/assignments for student"""
        student = self.db.query(Student).filter(Student.user_id == user_id).first()
        if not student:
            raise ValueError("Student profile not found")
        
        # Get student's batches and course IDs
        student_batches = student.batches if hasattr(student, 'batches') else []
        course_ids = [b.course_id for b in student_batches if b.course_id]
        
        if not course_ids:
            return {"tests": []}
        
        # Get all tests for enrolled courses
        tests = self.db.query(Test).filter(
            Test.course_id.in_(course_ids),
            Test.is_published == True
        ).order_by(Test.test_date.desc()).all()
        
        result = []
        for test in tests:
            # Check if student has submitted/completed
            test_result = self.db.query(TestResult).filter(
                TestResult.test_id == test.id,
                TestResult.student_id == student.id
            ).first()
            
            # Get course info
            course = self.db.query(Course).filter(Course.id == test.course_id).first()
            
            result.append({
                "id": test.id,
                "title": test.title,
                "description": test.description,
                "course": course.name if course else "General",
                "course_id": test.course_id,
                "total_marks": test.total_marks,
                "passing_marks": test.passing_marks,
                "duration_minutes": test.duration_minutes,
                "test_date": test.test_date.isoformat() if test.test_date else None,
                "teacher_name": test.teacher.user.full_name if test.teacher and test.teacher.user else "Admin",
                "is_completed": test_result is not None,
                "marks_obtained": test_result.marks_obtained if test_result else None,
                "percentage": test_result.percentage if test_result else None,
                "submitted_at": test_result.submitted_at.isoformat() if test_result and test_result.submitted_at else None,
                "created_at": test.created_at.isoformat() if test.created_at else None
            })
        
        return {"tests": result}
