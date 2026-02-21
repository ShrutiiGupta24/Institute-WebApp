from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class NotificationBase(BaseModel):
    title: str = Field(..., max_length=255)
    message: str
    audience: str = Field(default="all", max_length=50)
    expires_at: Optional[datetime] = None
    is_active: bool = True


class NotificationCreate(NotificationBase):
    pass


class NotificationUpdate(BaseModel):
    title: Optional[str] = Field(default=None, max_length=255)
    message: Optional[str] = None
    audience: Optional[str] = Field(default=None, max_length=50)
    expires_at: Optional[datetime] = None
    is_active: Optional[bool] = None


class NotificationResponse(NotificationBase):
    id: int
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    creator_name: Optional[str] = None
    creator_email: Optional[str] = None

    class Config:
        from_attributes = True
