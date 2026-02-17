# Institute Management System - Backend

A comprehensive backend API for managing coaching institute operations built with FastAPI and Python.

## Features

- **User Management**: Authentication and authorization for Admin, Teacher, and Student roles
- **Student Management**: Student profiles, enrollment, attendance tracking
- **Teacher Management**: Teacher profiles, course assignments, batch management
- **Course & Batch Management**: Create and manage courses and batches
- **Attendance System**: Mark and track student attendance
- **Fee Management**: Fee collection, payment tracking, and reports
- **Study Materials**: Upload and manage study materials
- **Tests & Assignments**: Create tests, evaluate results, and track performance
- **Payment Integration**: Support for Razorpay and Stripe payment gateways
- **Reports**: Generate attendance and fee collection reports

## Tech Stack

- **Framework**: FastAPI
- **Database**: SQLAlchemy ORM (supports PostgreSQL, MySQL, SQLite)
- **Authentication**: JWT tokens with bcrypt password hashing
- **Payment**: Razorpay and Stripe integration
- **Validation**: Pydantic models

## Project Structure

```
backend/
├── app/
│   ├── models/          # Database models
│   ├── routes/          # API endpoints
│   ├── schemas/         # Pydantic schemas
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── config.py        # Configuration
│   └── database.py      # Database setup
├── main.py              # Application entry point
├── requirements.txt     # Dependencies
└── .env.example         # Environment variables template
```

## Setup Instructions

### 1. Clone the repository

```bash
cd backend
```

### 2. Create virtual environment

```bash
python -m venv venv
```

### 3. Activate virtual environment

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Setup environment variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
- Database URL
- JWT secret key
- Payment gateway credentials
- Email configuration

### 6. Run database migrations

```bash
# For development with SQLite (default)
# Database tables will be created automatically on first run

# For production with PostgreSQL/MySQL
# You may want to use Alembic for migrations
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

### 7. Run the application

```bash
# Development mode with auto-reload
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, access the interactive API documentation at:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/students` - List all students
- `POST /api/admin/students` - Create student
- `PUT /api/admin/students/{id}` - Update student
- `DELETE /api/admin/students/{id}` - Delete student
- `GET /api/admin/teachers` - List all teachers
- `POST /api/admin/teachers` - Create teacher
- `GET /api/admin/courses` - List all courses
- `POST /api/admin/courses` - Create course
- `GET /api/admin/batches` - List all batches
- `POST /api/admin/batches` - Create batch
- `GET /api/admin/fees` - List all fees
- `POST /api/admin/fees` - Create fee record
- `GET /api/admin/reports/attendance` - Attendance report
- `GET /api/admin/reports/fees` - Fee report

### Student
- `GET /api/student/dashboard` - Student dashboard
- `GET /api/student/attendance` - My attendance
- `GET /api/student/fees` - My fees
- `GET /api/student/tests` - My test results
- `GET /api/student/study-materials` - Available materials
- `POST /api/student/tests/{id}/submit` - Submit test
- `GET /api/student/batches` - My batches

### Teacher
- `GET /api/teacher/dashboard` - Teacher dashboard
- `GET /api/teacher/batches` - My batches
- `POST /api/teacher/attendance` - Mark attendance
- `GET /api/teacher/attendance/batch/{id}` - Batch attendance
- `POST /api/teacher/study-materials` - Upload material
- `GET /api/teacher/study-materials` - My materials
- `POST /api/teacher/tests` - Create test
- `GET /api/teacher/tests` - My tests
- `POST /api/teacher/tests/{id}/evaluate` - Evaluate test
- `GET /api/teacher/students/performance/{id}` - Student performance

### Payment
- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify` - Verify payment
- `GET /api/payment/history` - Payment history
- `GET /api/payment/receipt/{id}` - Get receipt

## Database Models

- **User**: Base user model with authentication
- **Student**: Student profile and information
- **Teacher**: Teacher profile and information
- **Course**: Course details
- **Batch**: Class batches
- **Attendance**: Attendance records
- **Fee**: Fee records and payments
- **StudyMaterial**: Learning materials
- **Test**: Tests and assignments
- **TestResult**: Student test results

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Role-based access control (RBAC)
- Input validation with Pydantic
- SQL injection prevention with SQLAlchemy ORM

## Testing

```bash
# Install testing dependencies
pip install pytest pytest-cov httpx

# Run tests
pytest

# Run with coverage
pytest --cov=app tests/
```

## Deployment

### Using Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t institute-backend .
docker run -p 8000:8000 institute-backend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub or contact the development team.
