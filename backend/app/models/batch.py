from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

# Association table for many-to-many relationship between batches and students
batch_students = Table(
    'batch_students',
    Base.metadata,
    Column('batch_id', Integer, ForeignKey('batches.id'), primary_key=True),
    Column('student_id', Integer, ForeignKey('students.id'), primary_key=True)
)


class Batch(Base):
    __tablename__ = "batches"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    code = Column(String(50), unique=True, index=True, nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("teachers.id"))
    timing = Column(String(100))  # e.g., "7-8", "10:00 AM - 11:00 AM"
    days = Column(String(100))  # e.g., "Mon, Wed, Fri", "Tues"
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    max_students = Column(Integer, default=30)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    course = relationship("Course", back_populates="batches")
    teacher = relationship("Teacher", back_populates="batches")
    students = relationship("Student", secondary=batch_students, backref="batches")
    attendances = relationship("Attendance", back_populates="batch")
