from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, UserRole
from app.models.signup_request import SignupRequestStatus
from app.schemas.notification import NotificationCreate
from app.schemas.signup import (
    SignupSubmissionRequest,
    SignupSubmissionResponse,
    SignupRequestResponse,
    SignupDecisionPayload,
)
from app.services.notification_service import NotificationService
from app.services.signup_service import SignupService
from app.utils.auth import require_role

router = APIRouter()


@router.post("/", response_model=SignupSubmissionResponse, status_code=status.HTTP_201_CREATED)
async def submit_signup_request(payload: SignupSubmissionRequest, db: Session = Depends(get_db)):
    admin_user = _get_first_admin(db)
    if not admin_user:
        raise HTTPException(status_code=500, detail="Admin user not configured")

    signup_service = SignupService(db)
    try:
        signup_request = signup_service.create_request(payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    notification_service = NotificationService(db)
    timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
    message_lines = [
        f"Full name: {signup_request.full_name}",
        f"Email: {signup_request.email}",
        f"Phone: {signup_request.phone}",
        f"Role requested: {signup_request.desired_role}",
        f"Academic focus: {signup_request.academic_focus}",
        f"Request ID: {signup_request.id}",
        f"Submitted: {timestamp}",
    ]
    if signup_request.motivations:
        message_lines.insert(-1, f"Notes: {signup_request.motivations}")

    notification_payload = NotificationCreate(
        title=_trim_title(f"Signup approval needed • {signup_request.full_name}"),
        message="\n".join(message_lines),
        audience="admin",
        is_active=True,
        recipient_roles=[UserRole.ADMIN.value],
    )

    notification_service.create_notification(notification_payload, created_by=admin_user.id)
    return SignupSubmissionResponse(message="Request submitted. Admin will enable your login after verification.")


@router.get("", response_model=List[SignupRequestResponse], include_in_schema=False)
@router.get("/", response_model=List[SignupRequestResponse])
@router.get("/requests", response_model=List[SignupRequestResponse])
async def list_signup_requests(
    status: Optional[SignupRequestStatus] = Query(None),
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db),
):
    service = SignupService(db)
    return service.list_requests(status)


@router.post("/{request_id}/approve", response_model=SignupRequestResponse)
async def approve_signup_request(
    request_id: int,
    payload: Optional[SignupDecisionPayload] = None,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db),
):
    service = SignupService(db)
    signup_request = service.get_request(request_id)
    if not signup_request:
        raise HTTPException(status_code=404, detail="Signup request not found")
    try:
        return service.approve_request(signup_request, current_user, payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.post("/{request_id}/reject", response_model=SignupRequestResponse)
async def reject_signup_request(
    request_id: int,
    payload: Optional[SignupDecisionPayload] = None,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db),
):
    service = SignupService(db)
    signup_request = service.get_request(request_id)
    if not signup_request:
        raise HTTPException(status_code=404, detail="Signup request not found")
    try:
        return service.reject_request(signup_request, current_user, payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


def _trim_title(title: str) -> str:
    return title[:255]


def _get_first_admin(db: Session) -> Optional[User]:
    return (
        db.query(User)
        .filter(User.role == UserRole.ADMIN)
        .order_by(User.id.asc())
        .first()
    )
