import re
from typing import Optional
from datetime import datetime


def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_phone(phone: str) -> bool:
    """Validate phone number format"""
    pattern = r'^[+]?[\d\s-()]{10,}$'
    return re.match(pattern, phone) is not None


def validate_password(password: str) -> tuple[bool, str]:
    """
    Validate password strength
    Returns: (is_valid, error_message)
    """
    # Minimal validation
    if len(password) < 6:
        return False, "Password must be at least 6 characters long"
    
    if len(password) > 200:
        return False, "Password is too long (maximum 200 characters)"
    
    return True, ""
    
    return True, ""


def validate_date(date_str: str, format: str = "%Y-%m-%d") -> Optional[datetime]:
    """Validate and parse date string"""
    try:
        return datetime.strptime(date_str, format)
    except ValueError:
        return None


def validate_roll_number(roll_number: str) -> bool:
    """Validate roll number format"""
    pattern = r'^[A-Z0-9]{3,20}$'
    return re.match(pattern, roll_number.upper()) is not None


def validate_employee_id(employee_id: str) -> bool:
    """Validate employee ID format"""
    pattern = r'^[A-Z0-9]{3,20}$'
    return re.match(pattern, employee_id.upper()) is not None


def sanitize_string(text: str) -> str:
    """Sanitize input string"""
    if not text:
        return ""
    # Remove special characters that could be used for SQL injection
    return re.sub(r'[^\w\s@.-]', '', text).strip()
