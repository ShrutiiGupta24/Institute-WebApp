from datetime import datetime, timedelta
import json
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from app.models import Notification
from app.schemas.notification import (
    NotificationCreate,
    NotificationResponse,
    NotificationUpdate,
)


class NotificationService:
    def __init__(self, db: Session):
        self.db = db

    def _serialize(self, notification: Notification) -> NotificationResponse:
        creator = notification.creator
        recipient_roles = None
        if notification.recipient_roles:
            try:
                recipient_roles = json.loads(notification.recipient_roles)
            except json.JSONDecodeError:
                recipient_roles = None

        return NotificationResponse(
            id=notification.id,
            title=notification.title,
            message=notification.message,
            audience=notification.audience,
            expires_at=notification.expires_at,
            is_active=notification.is_active,
            recipient_roles=recipient_roles,
            created_by=notification.created_by,
            created_at=notification.created_at,
            updated_at=notification.updated_at,
            creator_name=creator.full_name if creator else None,
            creator_email=creator.email if creator else None,
        )

    def get_recent_notifications(self, include_inactive: bool = False, role_filter: Optional[str] = None) -> List[NotificationResponse]:
        cutoff = datetime.utcnow() - timedelta(days=365)
        query = (
            self.db.query(Notification)
            .options(joinedload(Notification.creator))
            .filter(Notification.created_at >= cutoff)
            .order_by(Notification.created_at.desc())
        )
        if not include_inactive:
            query = query.filter(Notification.is_active == True)  # noqa: E712

        notifications = query.all()
        responses = [self._serialize(notification) for notification in notifications]

        if role_filter:
            filtered = []
            for notification in responses:
                if not notification.recipient_roles:
                    filtered.append(notification)
                elif role_filter in notification.recipient_roles:
                    filtered.append(notification)
            return filtered

        return responses

    def get_notification(self, notification_id: int) -> Optional[Notification]:
        return (
            self.db.query(Notification)
            .options(joinedload(Notification.creator))
            .filter(Notification.id == notification_id)
            .first()
        )

    def create_notification(self, data: NotificationCreate, created_by: int) -> NotificationResponse:
        payload = data.dict()
        if payload.get("recipient_roles") is not None:
            payload["recipient_roles"] = json.dumps(payload["recipient_roles"])
        payload["created_by"] = created_by
        notification = Notification(**payload)
        self.db.add(notification)
        self.db.commit()
        self.db.refresh(notification)
        return self._serialize(notification)

    def update_notification(self, notification: Notification, data: NotificationUpdate) -> NotificationResponse:
        update_data = data.dict(exclude_unset=True)
        if "recipient_roles" in update_data:
            roles = update_data["recipient_roles"]
            update_data["recipient_roles"] = json.dumps(roles) if roles is not None else None
        for key, value in update_data.items():
            setattr(notification, key, value)
        self.db.commit()
        self.db.refresh(notification)
        return self._serialize(notification)

    def delete_notification(self, notification: Notification) -> None:
        self.db.delete(notification)
        self.db.commit()
