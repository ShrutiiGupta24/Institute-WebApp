from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.payment import PaymentCreate, PaymentVerify
from app.services.payment_service import PaymentService
from app.utils.auth import get_current_user
from app.models import User

router = APIRouter()


@router.post("/create-order")
async def create_payment_order(
    payment_data: PaymentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a payment order"""
    payment_service = PaymentService(db)
    try:
        order = payment_service.create_order(payment_data, current_user.id)
        return order
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/verify")
async def verify_payment(
    payment_verify: PaymentVerify,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Verify payment after completion"""
    payment_service = PaymentService(db)
    try:
        result = payment_service.verify_payment(payment_verify)
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/history")
async def get_payment_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get payment history for current user"""
    payment_service = PaymentService(db)
    return payment_service.get_user_payment_history(current_user.id)


@router.get("/receipt/{transaction_id}")
async def get_payment_receipt(
    transaction_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get payment receipt"""
    payment_service = PaymentService(db)
    return payment_service.get_receipt(transaction_id)
