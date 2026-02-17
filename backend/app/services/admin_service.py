from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from datetime import datetime, date
from typing import List, Optional
from app.models import *
from app.schemas.admin import *
from app.utils.auth import get_password_hash


class AdminService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_dashboard_stats(self) -> dict:
        """Get dashboard statistics"""
        total_students = self.db.query(Student).count()
        total_teachers = self.db.query(Teacher).count()
        total_courses = self.db.query(Course).count()
        total_batches = self.db.query(Batch).count()
        
        # Fee statistics
        total_fees = self.db.query(func.sum(Fee.amount)).scalar() or 0
        collected_fees = self.db.query(func.sum(Fee.paid_amount)).scalar() or 0
        pending_fees = total_fees - collected_fees
        
        return {
            "total_students": total_students,
            "total_teachers": total_teachers,
            "total_courses": total_courses,
            "total_batches": total_batches,
            "total_fees": total_fees,
            "collected_fees": collected_fees,
            "pending_fees": pending_fees
        }
    
    # Student Management
    def get_all_students(self, skip: int = 0, limit: int = 100) -> List[dict]:
        """Get all students"""
        students = self.db.query(Student).offset(skip).limit(limit).all()
        return [
            {
                "id": s.id,
                "name": s.user.full_name,
                "email": s.user.email,
                "phone": s.user.phone,
                "course": s.course,
                "batch": s.batch,
                "subjects": s.subjects,
                "status": s.status,
                "enrollment_date": s.enrollment_date
            }
            for s in students
        ]
    
    def create_student(self, student_data: StudentCreate) -> dict:
        """Create a new student with validation"""
        # Validate batch timing conflicts if batch code is provided
        if student_data.batch:
            # Find the batch by code
            new_batch = self.db.query(Batch).filter(Batch.code == student_data.batch).first()
            
            if new_batch and new_batch.timing:
                # Check if student already exists with conflicting batch timing
                # Since this is creation, we check if email already exists
                existing_user = self.db.query(User).filter(User.email == student_data.email).first()
                if existing_user:
                    raise ValueError(f"A student with email {student_data.email} already exists")
        
        # Create user first
        user = User(
            email=student_data.email,
            username=student_data.email.split('@')[0],  # Use email prefix as username
            full_name=student_data.name,
            phone=student_data.phone,
            role=UserRole.STUDENT,
            password_hash=get_password_hash(student_data.password),
            is_active=True
        )
        self.db.add(user)
        self.db.flush()
        
        # Create student profile
        student = Student(
            user_id=user.id,
            course=student_data.course,
            batch=student_data.batch,
            subjects=student_data.subjects,
            status=student_data.status,
            enrollment_date=student_data.enrollment_date or date.today()
        )
        self.db.add(student)
        self.db.commit()
        self.db.refresh(student)
        
        # Return combined data for response
        return {
            "id": student.id,
            "name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "course": student.course,
            "batch": student.batch,
            "subjects": student.subjects,
            "status": student.status,
            "enrollment_date": student.enrollment_date
        }
    
    def update_student(self, student_id: int, student_data: StudentUpdate) -> dict:
        """Update student information with batch timing validation"""
        student = self.db.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise ValueError("Student not found")
        
        # Validate batch timing conflict if batch is being updated
        if student_data.batch and student_data.batch != student.batch:
            # Find the new batch by code
            new_batch = self.db.query(Batch).filter(Batch.code == student_data.batch).first()
            
            if new_batch and new_batch.timing:
                # Find student's current batch
                current_batch = None
                if student.batch:
                    current_batch = self.db.query(Batch).filter(Batch.code == student.batch).first()
                
                # Check if the new batch has a timing conflict with current batch
                if current_batch and current_batch.timing:
                    if new_batch.timing == current_batch.timing:
                        raise ValueError(
                            f"Cannot assign student to batch '{new_batch.name}' at {new_batch.timing}. "
                            f"Student is already enrolled in batch '{current_batch.name}' at the same time ({current_batch.timing}). "
                            "A student cannot attend two classes at the same time."
                        )
                
                # Check for timing conflicts with batches the student is enrolled in through many-to-many relationship
                for enrolled_batch in student.batches:
                    if enrolled_batch.timing and enrolled_batch.timing == new_batch.timing and enrolled_batch.id != new_batch.id:
                        raise ValueError(
                            f"Cannot assign student to batch '{new_batch.name}' at {new_batch.timing}. "
                            f"Student is already enrolled in batch '{enrolled_batch.name}' at the same time. "
                            "A student cannot attend two classes at the same time."
                        )
        
        # Update user info (name and phone)
        if student_data.name:
            student.user.full_name = student_data.name
        if student_data.phone:
            student.user.phone = student_data.phone
        
        # Update student info (course, batch, subjects, status)
        if student_data.course:
            student.course = student_data.course
        if student_data.batch:
            student.batch = student_data.batch
        if student_data.subjects:
            student.subjects = student_data.subjects
        if student_data.status:
            student.status = student_data.status
        
        self.db.commit()
        self.db.refresh(student)
        
        # Return combined data for response
        return {
            "id": student.id,
            "name": student.user.full_name,
            "email": student.user.email,
            "phone": student.user.phone,
            "course": student.course,
            "batch": student.batch,
            "subjects": student.subjects,
            "status": student.status,
            "enrollment_date": student.enrollment_date
        }
    
    def delete_student(self, student_id: int):
        """Delete a student and all related records from the database"""
        student = (
            self.db.query(Student)
            .options(
                joinedload(Student.user),
                joinedload(Student.fees),
                joinedload(Student.attendances),
                joinedload(Student.test_results),
                joinedload(Student.batches)
            )
            .filter(Student.id == student_id)
            .first()
        )

        if not student:
            raise ValueError("Student not found")

        # Remove dependent records to satisfy FK constraints
        for fee in list(student.fees):
            self.db.delete(fee)

        for attendance in list(student.attendances):
            self.db.delete(attendance)

        for result in list(student.test_results):
            self.db.delete(result)

        # Clear many-to-many associations (batch_students table)
        student.batches.clear()

        # Delete student and corresponding user
        user = student.user
        self.db.delete(student)
        if user:
            self.db.delete(user)

        self.db.commit()
    
    def enroll_student_in_batch(self, student_id: int, batch_id: int):
        """Enroll a student in a batch with timing conflict validation"""
        student = self.db.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise ValueError("Student not found")
        
        batch = self.db.query(Batch).filter(Batch.id == batch_id).first()
        if not batch:
            raise ValueError("Batch not found")
        
        # Check if already enrolled
        if batch in student.batches:
            raise ValueError(f"Student is already enrolled in batch '{batch.name}'")
        
        # Check for timing conflicts with existing enrollments
        if batch.timing:
            for enrolled_batch in student.batches:
                if enrolled_batch.timing == batch.timing:
                    raise ValueError(
                        f"Cannot enroll student in batch '{batch.name}' at {batch.timing}. "
                        f"Student is already enrolled in batch '{enrolled_batch.name}' at the same time. "
                        "A student cannot attend two classes at the same time."
                    )
        
        # Enroll student
        student.batches.append(batch)
        self.db.commit()
        
        return {"message": f"Student enrolled in batch '{batch.name}' successfully"}
    
    def unenroll_student_from_batch(self, student_id: int, batch_id: int):
        """Remove a student from a batch"""
        student = self.db.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise ValueError("Student not found")
        
        batch = self.db.query(Batch).filter(Batch.id == batch_id).first()
        if not batch:
            raise ValueError("Batch not found")
        
        if batch not in student.batches:
            raise ValueError(f"Student is not enrolled in batch '{batch.name}'")
        
        student.batches.remove(batch)
        self.db.commit()
        
        return {"message": f"Student removed from batch '{batch.name}' successfully"}
    
    def get_student_batches(self, student_id: int) -> List[dict]:
        """Get all batches a student is enrolled in"""
        student = self.db.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise ValueError("Student not found")
        
        return [
            {
                "id": b.id,
                "name": b.name,
                "code": b.code,
                "timing": b.timing,
                "days": b.days,
                "course_name": b.course.name if b.course else None,
                "teacher_name": b.teacher.user.full_name if b.teacher else None
            }
            for b in student.batches
        ]
    
    # Teacher Management
    def get_all_teachers(self, skip: int = 0, limit: int = 100) -> List[dict]:
        """Get all teachers with their assigned batches"""
        teachers = self.db.query(Teacher)\
            .options(joinedload(Teacher.batches), joinedload(Teacher.user))\
            .offset(skip).limit(limit).all()
        return [
            {
                "id": t.id,
                "name": t.user.full_name,
                "email": t.user.email,
                "phone": t.user.phone,
                "subject": t.subject,
                "qualification": t.qualification,
                "experience": t.experience,
                "status": t.status,
                "assignedBatches": [batch.name for batch in t.batches] if t.batches else []
            }
            for t in teachers
        ]
    
    def create_teacher(self, teacher_data: TeacherCreate) -> dict:
        """Create a new teacher"""
        # Create user first
        user = User(
            email=teacher_data.email,
            username=teacher_data.email.split('@')[0],
            full_name=teacher_data.name,
            phone=teacher_data.phone,
            role=UserRole.TEACHER,
            password_hash=get_password_hash(teacher_data.password),
            is_active=True
        )
        self.db.add(user)
        self.db.flush()
        
        # Create teacher profile
        teacher = Teacher(
            user_id=user.id,
            subject=teacher_data.subject,
            qualification=teacher_data.qualification,
            experience=teacher_data.experience,
            status=teacher_data.status
        )
        self.db.add(teacher)
        self.db.commit()
        self.db.refresh(teacher)
        
        # Return combined data for response
        return {
            "id": teacher.id,
            "name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "subject": teacher.subject,
            "qualification": teacher.qualification,
            "experience": teacher.experience,
            "status": teacher.status
        }
    
    def update_teacher(self, teacher_id: int, teacher_data: TeacherUpdate) -> dict:
        """Update teacher information"""
        teacher = self.db.query(Teacher).filter(Teacher.id == teacher_id).first()
        if not teacher:
            raise ValueError("Teacher not found")
        
        # Update teacher profile fields
        for key, value in teacher_data.dict(exclude_unset=True, exclude={'name', 'phone'}).items():
            setattr(teacher, key, value)
        
        # Update user fields if provided
        if teacher_data.name or teacher_data.phone:
            user = teacher.user
            if teacher_data.name:
                user.full_name = teacher_data.name
            if teacher_data.phone:
                user.phone = teacher_data.phone
        
        self.db.commit()
        self.db.refresh(teacher)
        
        return {
            "id": teacher.id,
            "name": teacher.user.full_name,
            "email": teacher.user.email,
            "phone": teacher.user.phone,
            "subject": teacher.subject,
            "qualification": teacher.qualification,
            "experience": teacher.experience,
            "status": teacher.status
        }
    
    def delete_teacher(self, teacher_id: int):
        """Delete a teacher"""
        teacher = self.db.query(Teacher).filter(Teacher.id == teacher_id).first()
        if not teacher:
            raise ValueError("Teacher not found")
        
        # Also delete the associated user
        user = teacher.user
        self.db.delete(teacher)
        self.db.delete(user)
        self.db.commit()
    
    # Course Management
    def get_all_courses(self) -> List[Course]:
        """Get all courses"""
        return self.db.query(Course).all()
    
    def create_course(self, course_data: CourseCreate) -> Course:
        """Create a new course"""
        course = Course(**course_data.dict())
        self.db.add(course)
        self.db.commit()
        self.db.refresh(course)
        return course
    
    def update_course(self, course_id: int, course_data: CourseUpdate) -> Course:
        """Update a course"""
        course = self.db.query(Course).filter(Course.id == course_id).first()
        if not course:
            raise ValueError(f"Course with id {course_id} not found")
        
        for key, value in course_data.dict(exclude_unset=True).items():
            setattr(course, key, value)
        
        self.db.commit()
        self.db.refresh(course)
        return course
    
    def delete_course(self, course_id: int):
        """Delete a course"""
        course = self.db.query(Course).filter(Course.id == course_id).first()
        if not course:
            raise ValueError(f"Course with id {course_id} not found")
        
        self.db.delete(course)
        self.db.commit()
    
    # Batch Management
    def get_all_batches(self) -> List[Batch]:
        """Get all batches"""
        return self.db.query(Batch).all()
    
    def create_batch(self, batch_data: BatchCreate) -> Batch:
        """Create a new batch with validation"""
        teacher_id = batch_data.teacher_id
        
        # Validation 1: Check if batch with same name exists for same course and teacher
        if teacher_id:
            existing_batch = self.db.query(Batch).filter(
                Batch.name == batch_data.name,
                Batch.course_id == batch_data.course_id,
                Batch.teacher_id == teacher_id
            ).first()
            
            if existing_batch:
                raise ValueError(
                    f"A batch with name '{batch_data.name}' already exists for this teacher and course. "
                    "Please use a different batch name."
                )
        
        # Validation 2: Check for time conflicts with the same teacher
        if teacher_id and batch_data.timing:
            time_conflict = self.db.query(Batch).filter(
                Batch.teacher_id == teacher_id,
                Batch.timing == batch_data.timing
            ).first()
            
            if time_conflict:
                raise ValueError(
                    f"This teacher already has a batch '{time_conflict.name}' at {batch_data.timing}. "
                    "A teacher cannot teach two batches at the same time."
                )
        
        # Create batch
        batch = Batch(**batch_data.dict())
        self.db.add(batch)
        self.db.commit()
        self.db.refresh(batch)
        return batch
    
    def update_batch(self, batch_id: int, batch_data: BatchUpdate) -> Batch:
        """Update a batch with validation"""
        batch = self.db.query(Batch).filter(Batch.id == batch_id).first()
        if not batch:
            raise ValueError(f"Batch with id {batch_id} not found")
        
        # Get updated values with fallback to current batch values
        update_dict = batch_data.dict(exclude_unset=True)
        updated_name = update_dict.get('name', batch.name)
        updated_course_id = update_dict.get('course_id', batch.course_id)
        updated_teacher_id = update_dict.get('teacher_id', batch.teacher_id)
        updated_timing = update_dict.get('timing', batch.timing)
        
        # Validation 1: Check if batch with same name exists for same course and teacher (excluding current batch)
        if updated_teacher_id:
            existing_batch = self.db.query(Batch).filter(
                Batch.name == updated_name,
                Batch.course_id == updated_course_id,
                Batch.teacher_id == updated_teacher_id,
                Batch.id != batch_id  # Exclude current batch
            ).first()
            
            if existing_batch:
                raise ValueError(
                    f"A batch with name '{updated_name}' already exists for this teacher and course. "
                    "Please use a different batch name."
                )
        
        # Validation 2: Check for time conflicts with the same teacher (excluding current batch)
        if updated_teacher_id and updated_timing:
            time_conflict = self.db.query(Batch).filter(
                Batch.teacher_id == updated_teacher_id,
                Batch.timing == updated_timing,
                Batch.id != batch_id  # Exclude current batch
            ).first()
            
            if time_conflict:
                raise ValueError(
                    f"This teacher already has a batch '{time_conflict.name}' at {updated_timing}. "
                    "A teacher cannot teach two batches at the same time."
                )
        
        # Update batch fields
        for key, value in update_dict.items():
            setattr(batch, key, value)
        
        self.db.commit()
        self.db.refresh(batch)
        return batch
    
    def delete_batch(self, batch_id: int):
        """Delete a batch"""
        batch = self.db.query(Batch).filter(Batch.id == batch_id).first()
        if not batch:
            raise ValueError(f"Batch with id {batch_id} not found")
        
        self.db.delete(batch)
        self.db.commit()
    
    # Fee Management
    def get_all_fees(self, status: Optional[str] = None) -> List[Fee]:
        """Get all fee records"""
        query = self.db.query(Fee)
        if status:
            query = query.filter(Fee.status == status)
        return query.all()
    
    def create_fee(self, fee_data: FeeCreate) -> Fee:
        """Create a new fee record"""
        fee = Fee(**fee_data.dict())
        self.db.add(fee)
        self.db.commit()
        self.db.refresh(fee)
        return fee
    
    def update_fee(self, fee_id: int, fee_data: FeeUpdate) -> Fee:
        """Update a fee record"""
        fee = self.db.query(Fee).filter(Fee.id == fee_id).first()
        if not fee:
            raise ValueError(f"Fee record with id {fee_id} not found")
        
        for key, value in fee_data.dict(exclude_unset=True).items():
            setattr(fee, key, value)
        
        self.db.commit()
        self.db.refresh(fee)
        return fee
    
    def delete_fee(self, fee_id: int):
        """Delete a fee record"""
        fee = self.db.query(Fee).filter(Fee.id == fee_id).first()
        if not fee:
            raise ValueError(f"Fee record with id {fee_id} not found")
        
        self.db.delete(fee)
        self.db.commit()
    
    # Reports
    def get_attendance_report(self, start_date: Optional[str], end_date: Optional[str]) -> dict:
        """Get attendance report"""
        from datetime import datetime
        
        query = self.db.query(Attendance)
        
        if start_date:
            # Convert MM/DD/YYYY to YYYY-MM-DD
            parsed_date = datetime.strptime(start_date, "%m/%d/%Y").date()
            query = query.filter(Attendance.date >= parsed_date)
        if end_date:
            # Convert MM/DD/YYYY to YYYY-MM-DD
            parsed_date = datetime.strptime(end_date, "%m/%d/%Y").date()
            query = query.filter(Attendance.date <= parsed_date)
        
        total_records = query.count()
        present_count = query.filter(Attendance.is_present == True).count()
        
        return {
            "total_records": total_records,
            "present_count": present_count,
            "absent_count": total_records - present_count,
            "attendance_percentage": (present_count / total_records * 100) if total_records > 0 else 0
        }
    
    def get_fee_report(self) -> dict:
        """Get fee collection report"""
        total_fees = self.db.query(func.sum(Fee.amount)).scalar() or 0
        collected_fees = self.db.query(func.sum(Fee.paid_amount)).scalar() or 0
        
        pending_fees = self.db.query(Fee).filter(Fee.status == PaymentStatus.PENDING).count()
        paid_fees = self.db.query(Fee).filter(Fee.status == PaymentStatus.PAID).count()
        overdue_fees = self.db.query(Fee).filter(Fee.status == PaymentStatus.OVERDUE).count()
        
        return {
            "total_fees": total_fees,
            "collected_fees": collected_fees,
            "pending_amount": total_fees - collected_fees,
            "pending_count": pending_fees,
            "paid_count": paid_fees,
            "overdue_count": overdue_fees
        }
    
    def get_attendance_summary_report(self) -> List[dict]:
        """Get detailed attendance report for all students"""
        students = self.db.query(Student).all()
        report = []
        
        for student in students:
            # Get all attendance records for this student
            attendance_records = self.db.query(Attendance).filter(Attendance.student_id == student.id).all()
            total_classes = len(attendance_records)
            present_count = sum(1 for a in attendance_records if a.is_present)
            percentage = (present_count / total_classes * 100) if total_classes > 0 else 0
            
            report.append({
                "student_id": student.id,
                "student_name": student.user.full_name,
                "course": student.course,
                "total_classes": total_classes,
                "present_count": present_count,
                "absent_count": total_classes - present_count,
                "attendance_percentage": round(percentage, 2)
            })
        
        return report
    
    def get_test_marks_report(self) -> List[dict]:
        """Get test marks report for all students"""
        from app.models.test import TestResult
        
        test_results = self.db.query(TestResult).all()
        report = []
        
        for result in test_results:
            test = result.test
            student = result.student
            report.append({
                "id": result.id,
                "studentName": student.user.full_name if student else "N/A",
                "class": student.course if student else "N/A",
                "subject": test.title if test else "N/A",
                "testName": test.title if test else "Test",
                "maxMarks": test.total_marks if test else 100,
                "obtained": result.marks_obtained or 0,
                "uploadedBy": test.teacher.user.full_name if test and test.teacher else "Admin",
                "date": result.created_at.strftime("%Y-%m-%d") if result.created_at else "N/A"
            })
        
        return report
    
    def get_assignments_report(self) -> List[dict]:
        """Get assignments/tests report"""
        from app.models.study_material import StudyMaterial
        
        materials = self.db.query(StudyMaterial).filter(StudyMaterial.material_type == "assignment").all()
        report = []
        
        for material in materials:
            # Count submissions if needed (placeholder logic)
            batch = material.batch
            total_students = len(batch.students) if batch else 0
            submissions = 0  # This would need a submissions table to track
            
            report.append({
                "id": material.id,
                "testName": material.title,
                "class": batch.course.name if batch and batch.course else "N/A",
                "subject": material.subject or "N/A",
                "uploadedBy": material.teacher.user.full_name if material.teacher else "Admin",
                "dueDate": material.created_at.strftime("%Y-%m-%d") if material.created_at else "N/A",
                "submissions": submissions,
                "totalStudents": total_students
            })
        
        return report
