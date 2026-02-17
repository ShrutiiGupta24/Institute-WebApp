# Institute Management System - Web Application

A complete full-stack web application for managing coaching institute operations.

## 🌐 Application Architecture

### Technology Stack
- **Frontend**: React 19 (SPA - Single Page Application)
- **Backend**: FastAPI (Python REST API)
- **Database**: SQLite/PostgreSQL (SQLAlchemy ORM)
- **Authentication**: JWT (JSON Web Tokens)

### Application URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (Swagger UI)

## 📋 Prerequisites

- **Python 3.8+** - Backend runtime
- **Node.js 16+** - Frontend runtime
- **npm or yarn** - Package manager

## 🚀 Quick Start (Development)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env
# Edit .env and set SECRET_KEY

# Run database migrations (auto-creates tables)
python main.py

# Start backend server
python main.py
# OR
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will run on: **http://localhost:8000**

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd coaching

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run on: **http://localhost:3000**

## 👥 User Roles & Access

### Admin
- **Email**: admin@institute.com
- **Password**: admin123
- **Access**: Full system management
- **Dashboard**: /admin/dashboard

### Teacher
- **Dashboard**: /teacher/dashboard
- **Features**: Attendance marking, marks upload, study materials

### Student
- **Dashboard**: /student/dashboard
- **Features**: View attendance, tests, results, study materials, fees

## 📁 Application Structure

```
Institute App/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── routes/            # API endpoints
│   │   │   ├── auth.py        # Authentication
│   │   │   ├── admin.py       # Admin operations
│   │   │   ├── teacher.py     # Teacher operations
│   │   │   ├── student.py     # Student operations
│   │   │   └── payment.py     # Payment processing
│   │   ├── services/          # Business logic
│   │   ├── models/            # Database models
│   │   ├── schemas/           # Pydantic schemas
│   │   └── utils/             # Utilities
│   ├── main.py               # Application entry point
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Environment variables
│
├── coaching/                  # React Frontend
│   ├── public/               # Static files
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   │   ├── admin/        # Admin pages
│   │   │   ├── teacher/      # Teacher pages
│   │   │   └── student/      # Student pages
│   │   ├── services/         # API services
│   │   ├── store/            # State management
│   │   └── App.jsx           # Main app component
│   ├── package.json          # Node dependencies
│   └── config-overrides.js   # React config
│
└── README.md                 # This file
```

## 🔧 Environment Configuration

### Backend (.env)
```env
# Required
SECRET_KEY=your-secret-key-here-change-this

# Database (optional - defaults to SQLite)
DATABASE_URL=sqlite:///./institute.db
# For PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost/institute_db

# CORS (optional)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Optional Services
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
```

### Frontend (Environment)
API URL is configured in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Password reset request

### Admin APIs
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/students` - Student management
- `GET /api/admin/teachers` - Teacher management
- `GET /api/admin/batches` - Batch management
- `GET /api/admin/courses` - Course management
- `GET /api/admin/fees` - Fee management
- `GET /api/admin/reports` - Generate reports

### Teacher APIs
- `GET /api/teacher/dashboard` - Teacher dashboard
- `GET /api/teacher/batches` - Assigned batches
- `POST /api/teacher/attendance` - Mark attendance
- `GET /api/teacher/tests` - Created tests
- `POST /api/teacher/tests` - Create test
- `POST /api/teacher/tests/{id}/results` - Upload marks

### Student APIs
- `GET /api/student/dashboard` - Student dashboard
- `GET /api/student/attendance` - Attendance records
- `GET /api/student/tests` - Test results
- `GET /api/student/available-tests` - Available tests
- `GET /api/student/study-materials` - Study materials
- `GET /api/student/fees` - Fee status

## 📱 Features

### Admin Features
✅ Student Management (CRUD)
✅ Teacher Management (CRUD)
✅ Batch Management
✅ Course Management
✅ Fee Management
✅ Reports & Analytics
✅ Dashboard with quick stats

### Teacher Features
✅ View assigned batches
✅ Mark student attendance
✅ Upload student marks
✅ Create and manage tests
✅ Upload study materials
✅ View student performance

### Student Features
✅ View attendance records
✅ View test results and grades
✅ Access study materials
✅ View available tests/assignments
✅ Check fee payment status
✅ Download study materials

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing (bcrypt)
- CORS protection
- SQL injection prevention (SQLAlchemy ORM)
- XSS protection

## 📊 Database Schema

### Main Tables
- **users** - User accounts (admin, teacher, student)
- **students** - Student profiles
- **teachers** - Teacher profiles
- **courses** - Course information
- **batches** - Class batches
- **batch_students** - Student enrollments
- **attendance** - Attendance records
- **tests** - Tests/assignments
- **test_results** - Student test scores
- **study_materials** - Study materials
- **fees** - Fee records

## 🚀 Production Deployment

### Backend Deployment

1. **Update configuration**:
```python
# main.py - Set production settings
DEBUG = False
ENVIRONMENT = "production"
```

2. **Use production database**:
```env
DATABASE_URL=postgresql://user:password@production-host/db
```

3. **Deploy options**:
- **Heroku**: `Procfile` with gunicorn
- **AWS EC2**: systemd service
- **Docker**: Use provided Dockerfile
- **Railway/Render**: Auto-detect FastAPI

4. **Production server**:
```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend Deployment

1. **Build production bundle**:
```bash
cd coaching
npm run build
```

2. **Deploy options**:
- **Netlify**: Drag & drop `build/` folder
- **Vercel**: Connect GitHub repo
- **AWS S3 + CloudFront**: Upload build folder
- **Nginx**: Serve build folder as static files

3. **Update API URL**:
```javascript
// src/services/api.js
const API_BASE_URL = 'https://your-api-domain.com/api';
```

## 🐳 Docker Deployment

```bash
# Build and run with docker-compose
docker-compose up -d

# Access application
Frontend: http://localhost:3000
Backend: http://localhost:8000
```

## 🔍 API Documentation

Once backend is running, access interactive API docs:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd coaching
npm test
```

## 📈 Performance Optimization

- Frontend: React code splitting, lazy loading
- Backend: Database query optimization with joinedload()
- Caching: Redis for session management
- CDN: Static assets served via CDN
- Database: Indexed columns for faster queries

## 🆘 Troubleshooting

### Backend Issues

**"Module not found" errors**:
```bash
pip install -r requirements.txt
```

**"Database connection failed"**:
- Check DATABASE_URL in .env
- Ensure database server is running

**CORS errors**:
- Add frontend URL to ALLOWED_ORIGINS in .env

### Frontend Issues

**"npm start" fails**:
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

**API connection refused**:
- Ensure backend is running on port 8000
- Check API_BASE_URL in api.js

## 📞 Support

For issues or questions:
1. Check API documentation: http://localhost:8000/docs
2. Review error logs in terminal
3. Check browser console for frontend errors

## 📝 License

This project is private and proprietary.

---

**Status**: ✅ Production Ready
**Version**: 1.0.0
**Last Updated**: February 2026
