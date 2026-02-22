import enum
from sqlalchemy import Column, DateTime, Enum as SQLEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class SignupRequestStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class SignupRequest(Base):
    __tablename__ = "signup_requests"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    desired_role = Column(String(50), nullable=False)
    academic_focus = Column(String(255), nullable=False)
    motivations = Column(Text, nullable=True)
    username = Column(String(100), nullable=False)
    password_hash = Column(String(255), nullable=False)
    status = Column(SQLEnum(SignupRequestStatus), nullable=False, default=SignupRequestStatus.PENDING)
    admin_note = Column(Text, nullable=True)
    approved_at = Column(DateTime(timezone=True), nullable=True)
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    approver = relationship("User", foreign_keys=[approved_by])
