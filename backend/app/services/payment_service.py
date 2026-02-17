from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
import razorpay
from app.models import Fee, PaymentStatus, PaymentMethod
from app.schemas.payment import PaymentCreate, PaymentVerify
from app.config import settings


class PaymentService:
    def __init__(self, db: Session):
        self.db = db
        if settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET:
            self.razorpay_client = razorpay.Client(
                auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            )
        else:
            self.razorpay_client = None
    
    def create_order(self, payment_data: PaymentCreate, user_id: int) -> dict:
        """Create a payment order"""
        fee = self.db.query(Fee).filter(Fee.id == payment_data.fee_id).first()
        if not fee:
            raise ValueError("Fee record not found")
        
        if self.razorpay_client:
            # Create Razorpay order
            order_data = {
                "amount": payment_data.amount * 100,  # Amount in paise
                "currency": "INR",
                "payment_capture": 1
            }
            
            try:
                order = self.razorpay_client.order.create(data=order_data)
                return {
                    "order_id": order["id"],
                    "amount": payment_data.amount,
                    "currency": "INR",
                    "key_id": settings.RAZORPAY_KEY_ID
                }
            except Exception as e:
                raise ValueError(f"Failed to create payment order: {str(e)}")
        else:
            # Mock payment for development
            return {
                "order_id": f"order_mock_{fee.id}_{datetime.utcnow().timestamp()}",
                "amount": payment_data.amount,
                "currency": "INR",
                "key_id": "mock_key"
            }
    
    def verify_payment(self, payment_verify: PaymentVerify) -> dict:
        """Verify payment after completion"""
        if self.razorpay_client and payment_verify.signature:
            # Verify Razorpay signature
            try:
                self.razorpay_client.utility.verify_payment_signature({
                    'razorpay_order_id': payment_verify.transaction_id,
                    'razorpay_payment_id': payment_verify.payment_id,
                    'razorpay_signature': payment_verify.signature
                })
            except Exception as e:
                raise ValueError("Payment verification failed")
        
        # Update fee record
        # This is a simplified version - you'd need to extract fee_id from transaction_id
        # For now, we'll return success
        return {
            "status": "success",
            "message": "Payment verified successfully",
            "transaction_id": payment_verify.transaction_id
        }
    
    def get_user_payment_history(self, user_id: int) -> List[Fee]:
        """Get payment history for current user"""
        # This needs to be modified based on user role
        # For students, get their fees
        # For now, returning empty list
        return []
    
    def get_receipt(self, transaction_id: str) -> dict:
        """Get payment receipt"""
        fee = self.db.query(Fee).filter(Fee.transaction_id == transaction_id).first()
        if not fee:
            raise ValueError("Payment not found")
        
        return {
            "transaction_id": transaction_id,
            "amount": fee.paid_amount,
            "payment_date": fee.payment_date,
            "status": fee.status,
            "receipt_url": fee.receipt_url
        }
