from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime


class AttendanceRecord(BaseModel):
    student_id: int
    is_present: bool
    remarks: Optional[str] = None


class AttendanceResponse(BaseModel):
    id: int
    student_id: int
    batch_id: int
    date: date
    is_present: bool
    remarks: Optional[str] = None
    marked_by: int
    
    class Config:
        from_attributes = True


class AttendanceCreate(BaseModel):
    batch_id: int
    date: date
    records: List[AttendanceRecord]


class StudyMaterialCreate(BaseModel):
    title: str
    description: Optional[str] = None
    file_url: str
    file_type: Optional[str] = None
    file_size: Optional[int] = None
    course_id: Optional[int] = None
    is_public: bool = False


class TestCreate(BaseModel):
    title: str
    description: Optional[str] = None
    course_id: Optional[int] = None
    total_marks: int
    passing_marks: Optional[int] = None
    duration_minutes: Optional[int] = None
    test_date: Optional[datetime] = None


class TestEvaluation(BaseModel):
    student_id: int
    marks_obtained: int
    remarks: Optional[str] = None


class BulkTestResultCreate(BaseModel):
    test_id: int
    results: List[TestEvaluation]


class BatchResponse(BaseModel):
    id: int
    name: str
    code: str
    course_name: str
    student_count: int
    
    class Config:
        from_attributes = True


class StudentPerformance(BaseModel):
    student_id: int
    student_name: str
    attendance_percentage: float
    average_marks: float
    total_tests: int
    
    class Config:
        from_attributes = True
