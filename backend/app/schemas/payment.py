from pydantic import BaseModel
from typing import Optional


class PaymentCreate(BaseModel):
    fee_id: int
    amount: int
    payment_method: str


class PaymentVerify(BaseModel):
    transaction_id: str
    payment_id: str
    signature: Optional[str] = None


class PaymentResponse(BaseModel):
    id: int
    order_id: str
    amount: int
    currency: str = "INR"
    status: str
    
    class Config:
        from_attributes = True
