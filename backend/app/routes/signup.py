from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, UserRole
from app.schemas.notification import NotificationCreate
from app.schemas.signup import SignupSubmissionRequest, SignupSubmissionResponse
from app.services.notification_service import NotificationService

router = APIRouter()


@router.post("/", response_model=SignupSubmissionResponse, status_code=status.HTTP_201_CREATED)
async def submit_signup_request(payload: SignupSubmissionRequest, db: Session = Depends(get_db)):
    admin_user = (
        db.query(User)
        .filter(User.role == UserRole.ADMIN)
        .order_by(User.id.asc())
        .first()
    )
    if not admin_user:
        raise HTTPException(status_code=500, detail="Admin user not configured")

    service = NotificationService(db)
    timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
    message_lines = [
        f"Full name: {payload.full_name}",
        f"Email: {payload.email}",
        f"Phone: {payload.phone}",
        f"Role requested: {payload.desired_role}",
        f"Academic focus: {payload.academic_focus}",
    ]
    if payload.motivations:
        message_lines.append(f"Notes: {payload.motivations}")
    message_lines.append(f"Submitted: {timestamp}")

    notification_payload = NotificationCreate(
        title=_trim_title(f"Signup approval needed • {payload.full_name}"),
        message="\n".join(message_lines),
        audience="admin",
        is_active=True,
    )

    service.create_notification(notification_payload, created_by=admin_user.id)
    return SignupSubmissionResponse(message="Thanks! Our admin team will approve your access shortly.")


def _trim_title(title: str) -> str:
    return title[:255]
