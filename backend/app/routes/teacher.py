from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.teacher import *
from app.services.teacher_service import TeacherService
from app.utils.auth import get_current_user, require_role
from app.models import User, UserRole

router = APIRouter()

# ==========================================
# TEACHER ACCESS CONTROL POLICY
# ==========================================
# 1. Teachers can ONLY access data for their own batches
# 2. All endpoints filter by teacher_id automatically
# 3. Teachers CANNOT access:
#    - Other teachers' batches, students, tests, or materials
#    - Other teachers' test marks (cannot view or modify)
#    - Student fee information (admin only)
#    - Admin functions (batch/course/teacher management)
# 4. Authorization is enforced at backend level
# 5. Test results are filtered to show only marks from
#    tests created by the logged-in teacher
# ==========================================


@router.get("/dashboard")
async def get_teacher_dashboard(
    current_user: User = Depends(require_role(UserRole.TEACHER)),
    db: Session = Depends(get_db)
):
    """Get teacher dashboard data"""
    teacher_service = TeacherService(db)
    return teacher_service.get_dashboard(current_user.id)


@router.get("/batches")
async def get_my_batches(
    current_user: User = Depends(require_role(UserRole.TEACHER)),
    db: Session = Depends(get_db)
):
    """Get teacher's assigned batches"""
    teacher_service = TeacherService(db)
    return teacher_service.get_teacher_batches(current_user.id)


@router.post("/attendance", response_model=List[AttendanceResponse])
async def mark_attendance(
    attendance_data: AttendanceCreate,
    current_user: User = Depends(require_role(UserRole.TEACHER)),
    db: Session = Depends(get_db)
):
    """Mark attendance for students"""
    teacher_service = TeacherService(db)
    return teacher_service.mark_attendance(current_user.id, attendance_data)


@router.get("/attendance/batch/{batch_id}")
async def get_batch_attendance(
    batch_id: int,
    current_user: User = Depends(require_role(UserRole.TEACHER)),
    db: Session = Depends(get_db)
):
    """Get attendance for a specific batch"""
    teacher_service = TeacherService(db)
    return teacher_service.get_batch_attendance(batch_id)


@router.post("/study-materials")
async def upload_study_material(
    material_data: StudyMaterialCreate,
    current_user: User = Depends(require_role(UserRole.TEACHER)),
    db: Session = Depends(get_db)
):
    """Upload study material"""
    teacher_service = TeacherService(db)
    return teacher_service.create_study_material(current_user.id, material_data)


@router.get("/study-materials")
async def get_my_study_materials(
    current_user: User = Depends(require_role(UserRole.TEACHER)),
    db: Session = Depends(get_db)
):
    """Get teacher's uploaded study materials"""
    teacher_service = TeacherService(db)
    return teacher_service.get_teacher_study_materials(current_user.id)


@router.post("/tests")
async def create_test(
    test_data: TestCreate,
    current_user: User = Depends(require_role(UserRole.TEACHER)),
    db: Session = Depends(get_db)
):
    """Create a new test"""
    teacher_service = TeacherService(db)
    return teacher_service.create_test(current_user.id, test_data)


@router.get("/tests")
async def get_my_tests(
    current_user: User = Depends(require_role(UserRole.TEACHER)),
    db: Session = Depends(get_db)
):
    """Get teacher's created tests"""
    teacher_service = TeacherService(db)
    return teacher_service.get_teacher_tests(current_user.id)


@router.post("/tests/{test_id}/evaluate")
async def evaluate_test(
    test_id: int,
    evaluation: TestEvaluation,
    current_user: User = Depends(require_role(UserRole.TEACHER)),
    db: Session = Depends(get_db)
):
    """Evaluate a student's test (only for tests created by this teacher)"""
    teacher_service = TeacherService(db)
    return teacher_service.evaluate_test(current_user.id, test_id, evaluation)


@router.post("/tests/{test_id}/results")
async def upload_test_results(
    test_id: int,
    results: BulkTestResultCreate,
    current_user: User = Depends(require_role(UserRole.TEACHER)),
    db: Session = Depends(get_db)
):
    """Upload test results for multiple students"""
    teacher_service = TeacherService(db)
    return teacher_service.upload_test_results(current_user.id, test_id, results.results)


@router.get("/students/performance/{student_id}")
async def get_student_performance(
    student_id: int,
    current_user: User = Depends(require_role(UserRole.TEACHER)),
    db: Session = Depends(get_db)
):
    """Get performance report for a specific student (only showing this teacher's test results)"""
    teacher_service = TeacherService(db)
    return teacher_service.get_student_performance(current_user.id, student_id)
