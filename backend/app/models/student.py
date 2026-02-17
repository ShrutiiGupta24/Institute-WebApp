from sqlalchemy import Column, Integer, String, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    course = Column(String(100))
    batch = Column(String(100))
    subjects = Column(Text)
    status = Column(String(20), default="Active")
    enrollment_date = Column(Date)
    
    # Relationships
    user = relationship("User", backref="student_profile")
    attendances = relationship("Attendance", back_populates="student")
    fees = relationship("Fee", back_populates="student")
    test_results = relationship("TestResult", back_populates="student")
