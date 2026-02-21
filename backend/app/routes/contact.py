from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, UserRole
from app.schemas.contact import ContactSubmissionRequest, ContactSubmissionResponse
from app.schemas.notification import NotificationCreate
from app.services.notification_service import NotificationService

router = APIRouter()


@router.post("/", response_model=ContactSubmissionResponse, status_code=status.HTTP_201_CREATED)
async def submit_contact_form(payload: ContactSubmissionRequest, db: Session = Depends(get_db)):
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
        f"Prospective student: {payload.name}",
        f"Phone: {payload.phone}",
        f"Interested class: {payload.class_name}",
        f"Submitted: {timestamp}",
    ]

    notification_payload = NotificationCreate(
        title=_trim_title(f"New contact query from {payload.name}"),
        message="\n".join(message_lines),
        audience="admin",
        is_active=True,
    )

    service.create_notification(notification_payload, created_by=admin_user.id)
    return ContactSubmissionResponse(message="Thanks! Our team will reach out shortly.")


def _trim_title(title: str) -> str:
    return title[:255]
