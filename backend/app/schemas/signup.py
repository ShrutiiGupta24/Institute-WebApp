from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.models.user import UserRole
from app.models.signup_request import SignupRequestStatus


class SignupSubmissionRequest(BaseModel):
    full_name: str = Field(..., alias="fullName", min_length=2, max_length=120)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=10, pattern=r"^\d{10}$")
    username: str = Field(..., min_length=4, max_length=60)
    password: str = Field(..., min_length=8, max_length=128)
    desired_role: UserRole = Field(..., alias="desiredRole")
    academic_focus: str = Field(..., alias="academicFocus", min_length=2, max_length=120)
    motivations: Optional[str] = Field("", max_length=500)

    class Config:
        allow_population_by_field_name = True
        anystr_strip_whitespace = True


class SignupSubmissionResponse(BaseModel):
    message: str


class SignupRequestResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: str
    desired_role: str
    academic_focus: str
    motivations: Optional[str]
    username: str
    status: SignupRequestStatus
    admin_note: Optional[str] = None
    approved_at: Optional[datetime] = None
    approved_by: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class SignupDecisionPayload(BaseModel):
    note: Optional[str] = Field(default="", max_length=500)
