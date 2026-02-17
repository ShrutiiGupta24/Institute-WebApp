from datetime import datetime, date
from typing import Optional


def format_date(date_obj: Optional[date], format: str = "%Y-%m-%d") -> Optional[str]:
    """Format date object to string"""
    if date_obj is None:
        return None
    return date_obj.strftime(format)


def format_datetime(datetime_obj: Optional[datetime], format: str = "%Y-%m-%d %H:%M:%S") -> Optional[str]:
    """Format datetime object to string"""
    if datetime_obj is None:
        return None
    return datetime_obj.strftime(format)


def format_currency(amount: int) -> str:
    """Format amount as currency (Indian Rupees)"""
    return f"₹{amount:,.2f}"


def format_phone(phone: str) -> str:
    """Format phone number"""
    if not phone:
        return ""
    # Remove all non-digit characters
    digits = ''.join(filter(str.isdigit, phone))
    # Format as (XXX) XXX-XXXX for 10 digits
    if len(digits) == 10:
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
    return phone


def format_percentage(value: float, decimals: int = 2) -> str:
    """Format value as percentage"""
    return f"{value:.{decimals}f}%"


def calculate_percentage(obtained: int, total: int) -> float:
    """Calculate percentage"""
    if total == 0:
        return 0.0
    return (obtained / total) * 100


def format_file_size(size_bytes: int) -> str:
    """Format file size in human readable format"""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.2f} KB"
    elif size_bytes < 1024 * 1024 * 1024:
        return f"{size_bytes / (1024 * 1024):.2f} MB"
    else:
        return f"{size_bytes / (1024 * 1024 * 1024):.2f} GB"


def truncate_string(text: str, max_length: int = 100, suffix: str = "...") -> str:
    """Truncate string to maximum length"""
    if len(text) <= max_length:
        return text
    return text[:max_length - len(suffix)] + suffix


def format_name(first_name: str, last_name: str) -> str:
    """Format full name"""
    return f"{first_name.strip()} {last_name.strip()}".strip()
