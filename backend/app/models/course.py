from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database import Base


class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    class_category = Column(String(100))  # e.g., "9", "10", "11", "12", "JEE Main/Advance", "CUET", "B.com(P/H)"
    duration = Column(String(50))  # e.g., "12 months"
    monthly_fees = Column(String(50))  # e.g., "₹3,500"
    yearly_fees = Column(String(50))  # e.g., "₹40,000"
    description = Column(Text)
    
    # Relationships
    batches = relationship("Batch", back_populates="course")
