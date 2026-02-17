from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class AttendanceResponse(BaseModel):
    id: int
    date: date
    is_present: bool
    batch_id: int
    remarks: Optional[str] = None
    
    class Config:
        from_attributes = True


class FeeResponse(BaseModel):
    id: int
    amount: int
    due_date: date
    paid_amount: int
    payment_date: Optional[date] = None
    status: str
    transaction_id: Optional[str] = None
    
    class Config:
        from_attributes = True


class TestResultResponse(BaseModel):
    id: int
    test_id: int
    test_title: str
    marks_obtained: int
    total_marks: int
    percentage: Optional[int] = None
    remarks: Optional[str] = None
    submitted_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class StudyMaterialResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    file_url: str
    file_type: Optional[str] = None
    course_id: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class TestSubmission(BaseModel):
    marks_obtained: int
    remarks: Optional[str] = None


class BatchResponse(BaseModel):
    id: int
    name: str
    code: str
    course_name: str
    teacher_name: Optional[str] = None
    
    class Config:
        from_attributes = True
