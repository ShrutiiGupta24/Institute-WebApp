from pydantic import BaseModel, Field, constr


class ContactSubmissionRequest(BaseModel):
    name: constr(min_length=2, max_length=120)  # type: ignore[var-annotated]
    phone: constr(regex=r"^\d{10}$")  # type: ignore[var-annotated]
    class_name: str = Field(..., alias="className", max_length=100)

    class Config:
        allow_population_by_field_name = True
        anystr_strip_whitespace = True


class ContactSubmissionResponse(BaseModel):
    message: str
