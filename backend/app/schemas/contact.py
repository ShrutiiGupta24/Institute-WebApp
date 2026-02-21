from pydantic import BaseModel, Field


class ContactSubmissionRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    phone: str = Field(..., min_length=10, max_length=10, pattern=r"^\d{10}$")
    class_name: str = Field(..., alias="className", max_length=100)

    class Config:
        allow_population_by_field_name = True
        anystr_strip_whitespace = True


class ContactSubmissionResponse(BaseModel):
    message: str
