from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Teacher(Base):
    __tablename__ = "teachers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    subject = Column(String(255))
    qualification = Column(String(255))
    experience = Column(String(50))  # e.g., "5 years"
    status = Column(String(20), default="Active")
    
    # Relationships
    user = relationship("User", backref="teacher_profile")
    batches = relationship("Batch", back_populates="teacher")
    study_materials = relationship("StudyMaterial", back_populates="teacher")
    tests = relationship("Test", back_populates="teacher")
