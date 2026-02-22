from datetime import datetime
from typing import List, Optional
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.models import User, UserRole
from app.models.signup_request import SignupRequest, SignupRequestStatus
from app.schemas.signup import SignupSubmissionRequest, SignupDecisionPayload
from app.utils.auth import get_password_hash


class SignupService:
    def __init__(self, db: Session):
        self.db = db

    def create_request(self, payload: SignupSubmissionRequest) -> SignupRequest:
        normalized_email = payload.email.strip().lower()
        normalized_username = payload.username.strip()

        self._ensure_unique_user(normalized_email, normalized_username)

        request = SignupRequest(
            full_name=payload.full_name.strip(),
            email=normalized_email,
            phone=payload.phone.strip(),
            desired_role=payload.desired_role.value,
            academic_focus=payload.academic_focus.strip(),
            motivations=payload.motivations.strip() if payload.motivations else None,
            username=normalized_username,
            password_hash=get_password_hash(payload.password),
            status=SignupRequestStatus.PENDING,
        )
        self.db.add(request)
        self.db.commit()
        self.db.refresh(request)
        return request

    def list_requests(self, status: Optional[SignupRequestStatus] = None) -> List[SignupRequest]:
        query = self.db.query(SignupRequest).order_by(SignupRequest.created_at.desc())
        if status:
            query = query.filter(SignupRequest.status == status)
        return query.all()

    def get_request(self, request_id: int) -> Optional[SignupRequest]:
        return self.db.query(SignupRequest).filter(SignupRequest.id == request_id).first()

    def approve_request(self, signup_request: SignupRequest, admin_user: User, payload: Optional[SignupDecisionPayload] = None) -> SignupRequest:
        if signup_request.status != SignupRequestStatus.PENDING:
            raise ValueError("Signup request already processed")

        self._ensure_unique_user(signup_request.email, signup_request.username, check_pending=False)

        user = User(
            email=signup_request.email,
            username=signup_request.username,
            full_name=signup_request.full_name,
            phone=signup_request.phone,
            role=UserRole(signup_request.desired_role),
            password_hash=signup_request.password_hash,
            is_active=True,
            is_verified=True,
        )
        self.db.add(user)

        signup_request.status = SignupRequestStatus.APPROVED
        signup_request.approved_at = datetime.utcnow()
        signup_request.approved_by = admin_user.id
        if payload and payload.note:
            signup_request.admin_note = payload.note

        self.db.commit()
        self.db.refresh(signup_request)
        return signup_request

    def reject_request(self, signup_request: SignupRequest, admin_user: User, payload: Optional[SignupDecisionPayload] = None) -> SignupRequest:
        if signup_request.status != SignupRequestStatus.PENDING:
            raise ValueError("Signup request already processed")

        signup_request.status = SignupRequestStatus.REJECTED
        signup_request.approved_at = datetime.utcnow()
        signup_request.approved_by = admin_user.id
        signup_request.admin_note = payload.note if payload and payload.note else None

        self.db.commit()
        self.db.refresh(signup_request)
        return signup_request

    def _ensure_unique_user(self, email: str, username: str, check_pending: bool = True) -> None:
        email_exists = self.db.query(User).filter(func.lower(User.email) == email.lower()).first()
        if email_exists:
            raise ValueError("Email already registered")

        username_exists = self.db.query(User).filter(func.lower(User.username) == username.lower()).first()
        if username_exists:
            raise ValueError("Username already taken")

        if check_pending:
            pending_request = (
                self.db.query(SignupRequest)
                .filter(
                    func.lower(SignupRequest.email) == email.lower(),
                    SignupRequest.status == SignupRequestStatus.PENDING,
                )
                .first()
            )
            if pending_request:
                raise ValueError("Signup request already pending for this email")
