from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime


class StudentBase(BaseModel):
    course: Optional[str] = None
    batch: Optional[str] = None
    subjects: Optional[str] = None
    status: str = "Active"


class StudentCreate(StudentBase):
    name: str
    email: str
    phone: str
    password: str
    enrollment_date: Optional[date] = None


class StudentUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    course: Optional[str] = None
    batch: Optional[str] = None
    subjects: Optional[str] = None
    status: Optional[str] = None


class StudentResponse(StudentBase):
    id: int
    name: str
    email: str
    phone: str
    enrollment_date: Optional[date] = None
    
    class Config:
        from_attributes = True


class CourseBase(BaseModel):
    name: str
    class_category: Optional[str] = None  # e.g., "9", "10", "11", "12", "JEE Main/Advance", "CUET", "B.com(P/H)"
    duration: Optional[str] = None  # e.g., "12 months"
    monthly_fees: Optional[str] = None  # e.g., "₹3,500"
    yearly_fees: Optional[str] = None  # e.g., "₹40,000"
    description: Optional[str] = None


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    name: Optional[str] = None
    class_category: Optional[str] = None
    duration: Optional[str] = None
    monthly_fees: Optional[str] = None
    yearly_fees: Optional[str] = None
    description: Optional[str] = None


class CourseResponse(CourseBase):
    id: int
    
    class Config:
        from_attributes = True


class BatchBase(BaseModel):
    name: str
    code: str
    course_id: int
    teacher_id: Optional[int] = None
    timing: Optional[str] = None
    days: Optional[str] = None
    max_students: int = 30


class BatchCreate(BatchBase):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class BatchUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    course_id: Optional[int] = None
    teacher_id: Optional[int] = None
    timing: Optional[str] = None
    days: Optional[str] = None
    max_students: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class BatchResponse(BatchBase):
    id: int
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class TeacherBase(BaseModel):
    subject: Optional[str] = None
    qualification: Optional[str] = None
    experience: Optional[str] = None
    status: str = "Active"


class TeacherCreate(TeacherBase):
    name: str
    email: str
    phone: str
    password: str


class TeacherUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    subject: Optional[str] = None
    qualification: Optional[str] = None
    experience: Optional[str] = None
    status: Optional[str] = None


class TeacherResponse(TeacherBase):
    id: int
    name: str
    email: str
    phone: str
    assignedBatches: Optional[List[str]] = []
    
    class Config:
        from_attributes = True


class FeeBase(BaseModel):
    student_id: int
    amount: int
    due_date: date


class FeeCreate(FeeBase):
    pass


class FeeUpdate(BaseModel):
    student_id: Optional[int] = None
    amount: Optional[int] = None
    due_date: Optional[date] = None
    paid_amount: Optional[int] = None
    payment_date: Optional[date] = None
    status: Optional[str] = None
    payment_method: Optional[str] = None
    transaction_id: Optional[str] = None
    remarks: Optional[str] = None


class FeeResponse(FeeBase):
    id: int
    paid_amount: int
    payment_date: Optional[date] = None
    status: str
    transaction_id: Optional[str] = None
    
    class Config:
        from_attributes = True
