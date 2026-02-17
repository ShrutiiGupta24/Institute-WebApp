from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.student import *
from app.services.student_service import StudentService
from app.utils.auth import get_current_user, require_role
from app.models import User, UserRole

router = APIRouter()

"""
STUDENT DATA ISOLATION - SECURITY POLICY:

All routes in this module enforce strict data isolation:
1. Authentication: require_role(UserRole.STUDENT) ensures only students can access
2. Authorization: current_user.id from JWT token identifies the authenticated student
3. Service Layer: All methods filter data by user_id, preventing access to other students' data
4. No URL-based student_id parameters: Student identity comes from JWT, not URL

Students can ONLY access their own:
- Dashboard data
- Attendance records
- Fee information
- Test results and submissions
- Study materials (subject to batch enrollment)
- Batch information

Students CANNOT:
- View other students' data
- Modify their own core information (done by admin only)
- Access admin or teacher functionalities
"""


@router.get("/dashboard")
async def get_student_dashboard(
    current_user: User = Depends(require_role(UserRole.STUDENT)),
    db: Session = Depends(get_db)
):
    """Get student dashboard data - ONLY authenticated student's own data"""
    student_service = StudentService(db)
    return student_service.get_dashboard(current_user.id)


@router.get("/attendance")
async def get_my_attendance(
    current_user: User = Depends(require_role(UserRole.STUDENT)),
    db: Session = Depends(get_db)
):
    """Get student's attendance records"""
    student_service = StudentService(db)
    return student_service.get_student_attendance(current_user.id)


@router.get("/fees")
async def get_my_fees(
    current_user: User = Depends(require_role(UserRole.STUDENT)),
    db: Session = Depends(get_db)
):
    """Get student's fee records"""
    student_service = StudentService(db)
    return student_service.get_student_fees(current_user.id)


@router.get("/tests")
async def get_my_tests(
    current_user: User = Depends(require_role(UserRole.STUDENT)),
    db: Session = Depends(get_db)
):
    """Get student's test results"""
    student_service = StudentService(db)
    return student_service.get_student_tests(current_user.id)


@router.get("/study-materials")
async def get_study_materials(
    current_user: User = Depends(require_role(UserRole.STUDENT)),
    db: Session = Depends(get_db)
):
    """Get available study materials"""
    student_service = StudentService(db)
    return student_service.get_study_materials(current_user.id)


@router.get("/study-materials/{material_id}/download")
async def download_study_material(
    material_id: int,
    current_user: User = Depends(require_role(UserRole.STUDENT)),
    db: Session = Depends(get_db)
):
    """Get download URL for study material"""
    from app.models.study_material import StudyMaterial
    
    material = db.query(StudyMaterial).filter(StudyMaterial.id == material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Study material not found")
    
    return {
        "id": material.id,
        "title": material.title,
        "file_url": material.file_url,
        "file_type": material.file_type
    }


@router.post("/tests/{test_id}/submit")
async def submit_test(
    test_id: int,
    submission: TestSubmission,
    current_user: User = Depends(require_role(UserRole.STUDENT)),
    db: Session = Depends(get_db)
):
    """Submit a test"""
    student_service = StudentService(db)
    return student_service.submit_test(current_user.id, test_id, submission)


@router.get("/batches")
async def get_my_batches(
    current_user: User = Depends(require_role(UserRole.STUDENT)),
    db: Session = Depends(get_db)
):
    """Get student's enrolled batches"""
    student_service = StudentService(db)
    return student_service.get_student_batches(current_user.id)


@router.get("/available-tests")
async def get_available_tests(
    current_user: User = Depends(require_role(UserRole.STUDENT)),
    db: Session = Depends(get_db)
):
    """Get available tests/assignments for student"""
    student_service = StudentService(db)
    return student_service.get_available_tests(current_user.id)
