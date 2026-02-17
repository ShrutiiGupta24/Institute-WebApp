from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.admin import *
from app.services.admin_service import AdminService
from app.utils.auth import get_current_user, require_role
from app.models import User, UserRole

router = APIRouter()


@router.get("/dashboard")
async def get_dashboard_stats(
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Get admin dashboard statistics"""
    admin_service = AdminService(db)
    return admin_service.get_dashboard_stats()


# Student Management
@router.get("/students", response_model=List[StudentResponse])
async def get_all_students(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Get all students"""
    admin_service = AdminService(db)
    return admin_service.get_all_students(skip, limit)


@router.post("/students", response_model=StudentResponse)
async def create_student(
    student_data: StudentCreate,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Create a new student"""
    try:
        admin_service = AdminService(db)
        return admin_service.create_student(student_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/students/{student_id}", response_model=StudentResponse)
async def update_student(
    student_id: int,
    student_data: StudentUpdate,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Update student information"""
    try:
        admin_service = AdminService(db)
        return admin_service.update_student(student_id, student_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/students/{student_id}")
async def delete_student(
    student_id: int,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Delete a student"""
    admin_service = AdminService(db)
    admin_service.delete_student(student_id)
    return {"message": "Student deleted successfully"}


# Student Batch Enrollment Management
@router.post("/students/{student_id}/batches/{batch_id}")
async def enroll_student_in_batch(
    student_id: int,
    batch_id: int,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Enroll a student in a batch"""
    try:
        admin_service = AdminService(db)
        return admin_service.enroll_student_in_batch(student_id, batch_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/students/{student_id}/batches/{batch_id}")
async def unenroll_student_from_batch(
    student_id: int,
    batch_id: int,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Remove a student from a batch"""
    try:
        admin_service = AdminService(db)
        return admin_service.unenroll_student_from_batch(student_id, batch_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/students/{student_id}/batches")
async def get_student_batches(
    student_id: int,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Get all batches a student is enrolled in"""
    try:
        admin_service = AdminService(db)
        return admin_service.get_student_batches(student_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# Teacher Management
@router.get("/teachers", response_model=List[TeacherResponse])
async def get_all_teachers(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Get all teachers"""
    admin_service = AdminService(db)
    return admin_service.get_all_teachers(skip, limit)


@router.post("/teachers", response_model=TeacherResponse)
async def create_teacher(
    teacher_data: TeacherCreate,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Create a new teacher"""
    admin_service = AdminService(db)
    return admin_service.create_teacher(teacher_data)


@router.put("/teachers/{teacher_id}", response_model=TeacherResponse)
async def update_teacher(
    teacher_id: int,
    teacher_data: TeacherUpdate,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Update a teacher"""
    admin_service = AdminService(db)
    return admin_service.update_teacher(teacher_id, teacher_data)


@router.delete("/teachers/{teacher_id}")
async def delete_teacher(
    teacher_id: int,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Delete a teacher"""
    admin_service = AdminService(db)
    admin_service.delete_teacher(teacher_id)
    return {"message": "Teacher deleted successfully"}


# Course Management
@router.get("/courses", response_model=List[CourseResponse])
async def get_all_courses(
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Get all courses"""
    admin_service = AdminService(db)
    return admin_service.get_all_courses()


@router.post("/courses", response_model=CourseResponse)
async def create_course(
    course_data: CourseCreate,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Create a new course"""
    admin_service = AdminService(db)
    return admin_service.create_course(course_data)


@router.put("/courses/{course_id}", response_model=CourseResponse)
async def update_course(
    course_id: int,
    course_data: CourseUpdate,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Update a course"""
    admin_service = AdminService(db)
    return admin_service.update_course(course_id, course_data)


@router.delete("/courses/{course_id}")
async def delete_course(
    course_id: int,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Delete a course"""
    admin_service = AdminService(db)
    admin_service.delete_course(course_id)
    return {"message": "Course deleted successfully"}


# Batch Management
@router.get("/batches", response_model=List[BatchResponse])
async def get_all_batches(
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Get all batches"""
    admin_service = AdminService(db)
    return admin_service.get_all_batches()


@router.post("/batches", response_model=BatchResponse)
async def create_batch(
    batch_data: BatchCreate,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Create a new batch"""
    try:
        admin_service = AdminService(db)
        return admin_service.create_batch(batch_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/batches/{batch_id}", response_model=BatchResponse)
async def update_batch(
    batch_id: int,
    batch_data: BatchUpdate,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Update a batch"""
    try:
        admin_service = AdminService(db)
        return admin_service.update_batch(batch_id, batch_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/batches/{batch_id}")
async def delete_batch(
    batch_id: int,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Delete a batch"""
    admin_service = AdminService(db)
    admin_service.delete_batch(batch_id)
    return {"message": "Batch deleted successfully"}


# Fee Management
@router.get("/fees")
async def get_all_fees(
    status: str = Query(None),
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Get all fee records"""
    admin_service = AdminService(db)
    return admin_service.get_all_fees(status)


@router.post("/fees")
async def create_fee(
    fee_data: FeeCreate,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Create a new fee record"""
    admin_service = AdminService(db)
    return admin_service.create_fee(fee_data)


@router.put("/fees/{fee_id}")
async def update_fee(
    fee_id: int,
    fee_data: FeeUpdate,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Update a fee record"""
    admin_service = AdminService(db)
    return admin_service.update_fee(fee_id, fee_data)


@router.delete("/fees/{fee_id}")
async def delete_fee(
    fee_id: int,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Delete a fee record"""
    admin_service = AdminService(db)
    admin_service.delete_fee(fee_id)
    return {"message": "Fee record deleted successfully"}


# Reports
@router.get("/reports/attendance")
async def get_attendance_report(
    start_date: str = Query(None),
    end_date: str = Query(None),
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Get attendance summary report for all students"""
    admin_service = AdminService(db)
    return admin_service.get_attendance_summary_report()


@router.get("/reports/fees")
async def get_fee_report(
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Get fee collection report"""
    admin_service = AdminService(db)
    return admin_service.get_fee_report()


@router.get("/reports/test-marks")
async def get_test_marks_report(
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Get test marks report"""
    admin_service = AdminService(db)
    return admin_service.get_test_marks_report()


@router.get("/reports/assignments")
async def get_assignments_report(
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Get assignments/tests report"""
    admin_service = AdminService(db)
    return admin_service.get_assignments_report()
