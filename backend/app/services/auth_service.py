from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models import User, UserRole
from app.schemas.auth import UserCreate, Token
from app.utils.auth import get_password_hash, verify_password, create_access_token
from app.utils.validators import validate_email, validate_password


class AuthService:
    def __init__(self, db: Session):
        self.db = db
    
    def register_user(self, user_data: UserCreate) -> User:
        """Register a new user"""
        normalized_email = user_data.email.strip().lower()
        # Validate email
        if not validate_email(normalized_email):
            raise ValueError("Invalid email format")
        
        # Check if user already exists
        existing_user = self.db.query(User).filter(User.email == normalized_email).first()
        if existing_user:
            raise ValueError("Email already registered")
        
        existing_username = self.db.query(User).filter(User.username == user_data.username).first()
        if existing_username:
            raise ValueError("Username already taken")
        
        # Validate password
        is_valid, error_msg = validate_password(user_data.password)
        if not is_valid:
            raise ValueError(error_msg)
        
        # Create user
        user = User(
            email=normalized_email,
            username=user_data.username,
            full_name=user_data.full_name,
            phone=user_data.phone,
            role=user_data.role,
            password_hash=get_password_hash(user_data.password),
            is_active=True
        )
        
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        
        return user
    
    def login(self, email: str, password: str) -> Token:
        """Authenticate user and return token"""
        normalized_email = email.strip().lower()
        user = self.db.query(User).filter(User.email == normalized_email).first()
        
        if not user or not verify_password(password, user.password_hash):
            return None
        
        if not user.is_active:
            raise ValueError("User account is inactive")
        
        # Update last login
        user.last_login = datetime.utcnow()
        self.db.commit()
        
        # Create access token
        access_token = create_access_token(
            data={"sub": user.email, "role": user.role.value}
        )
        
        # Prepare user data
        user_data = {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role.value,
            "is_active": user.is_active
        }
        
        return Token(access_token=access_token, token_type="bearer", user=user_data)
    
    def create_access_token(self, data: dict) -> str:
        """Create a new access token"""
        return create_access_token(data)
