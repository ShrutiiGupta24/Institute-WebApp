from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class SignupSubmissionRequest(BaseModel):
    full_name: str = Field(..., alias="fullName", min_length=2, max_length=120)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=10, pattern=r"^\d{10}$")
    desired_role: str = Field(..., alias="desiredRole", min_length=3, max_length=60)
    academic_focus: str = Field(..., alias="academicFocus", min_length=2, max_length=120)
    motivations: Optional[str] = Field("", max_length=500)

    class Config:
        allow_population_by_field_name = True
        anystr_strip_whitespace = True


class SignupSubmissionResponse(BaseModel):
    message: str
