# 🔒 Teacher Access Control & Data Isolation

## Overview
This document explains how teachers are restricted to accessing only their own data and cannot see other teachers' information or student fee details.

---

## 🛡️ Backend Security (API Level)

### 1. Authentication & Authorization

All teacher endpoints require:
- **JWT Authentication**: Valid token required
- **Role-Based Access Control (RBAC)**: Only users with `UserRole.TEACHER` can access
- **User Context**: `current_user` is automatically extracted from JWT token

```python
# Example from backend/app/routes/teacher.py
@router.get("/batches")
async def get_my_batches(
    current_user: User = Depends(require_role(UserRole.TEACHER)),
    db: Session = Depends(get_db)
):
    """Get teacher's assigned batches"""
    teacher_service = TeacherService(db)
    return teacher_service.get_teacher_batches(current_user.id)
```

### 2. Data Filtering by Teacher ID

**Every teacher endpoint filters data by the logged-in teacher's ID:**

#### Batches
```python
# backend/app/services/teacher_service.py
def get_teacher_batches(self, user_id: int):
    teacher = self.db.query(Teacher).filter(Teacher.user_id == user_id).first()
    batches = self.db.query(Batch).filter(Batch.teacher_id == teacher.id).all()
    # Returns ONLY batches assigned to this teacher
```

#### Students
- Teachers can only see students enrolled in **their own batches**
- Students from other teachers' batches are completely hidden

```python
def get_teacher_batches(self, user_id: int):
    # ...
    for batch in batches:
        # Only includes students from this teacher's batches
        result.append({
            "students": [s for s in batch.students]
        })
```

#### Study Materials
```python
def get_teacher_study_materials(self, user_id: int):
    teacher = self.db.query(Teacher).filter(Teacher.user_id == user_id).first()
    # Returns ONLY materials uploaded by this teacher
    return self.db.query(StudyMaterial).filter(
        StudyMaterial.teacher_id == teacher.id
    ).all()
```

#### Tests
```python
def get_teacher_tests(self, user_id: int):
    teacher = self.db.query(Teacher).filter(Teacher.user_id == user_id).first()
    # Returns ONLY tests created by this teacher
    tests = self.db.query(Test).filter(Test.teacher_id == teacher.id).all()
```

#### Attendance
```python
def mark_attendance(self, user_id: int, attendance_data: AttendanceCreate):
    teacher = self.db.query(Teacher).filter(Teacher.user_id == user_id).first()
    batch = self.db.query(Batch).filter(Batch.id == attendance_data.batch_id).first()
    
    # Authorization check: Can only mark attendance for own batches
    if not batch or batch.teacher_id != teacher.id:
        raise ValueError("Unauthorized to mark attendance for this batch")
```

#### Test Results
```python
def upload_test_results(self, user_id: int, test_id: int, results_data: List):
    teacher = self.db.query(Teacher).filter(Teacher.user_id == user_id).first()
    test = self.db.query(Test).filter(Test.id == test_id).first()
    
    # Authorization check: Can only upload results for own tests
    if not test or test.teacher_id != teacher.id:
        raise ValueError("Test not found or unauthorized")
```

#### View/Modify Test Marks
```python
def evaluate_test(self, user_id: int, test_id: int, evaluation: TestEvaluation):
    teacher = self.db.query(Teacher).filter(Teacher.user_id == user_id).first()
    test = self.db.query(Test).filter(Test.id == test_id).first()
    
    # Authorization check: Can only modify marks for own tests
    if not test or test.teacher_id != teacher.id:
        raise ValueError("Test not found or unauthorized - You can only modify your own test results")

def get_student_performance(self, user_id: int, student_id: int):
    teacher = self.db.query(Teacher).filter(Teacher.user_id == user_id).first()
    
    # Returns ONLY test results from tests created by THIS teacher
    test_results = self.db.query(TestResult).join(Test).filter(
        TestResult.student_id == student_id,
        Test.teacher_id == teacher.id  # Filter by teacher
    ).all()
```

---

## 🚫 Restricted Access

### Teachers CANNOT:

❌ **Access Other Teachers' Data**
- Cannot see batches assigned to other teachers
- Cannot see students in other teachers' batches
- Cannot see tests created by other teachers
- Cannot see study materials uploaded by other teachers
- Cannot mark attendance for other teachers' batches
- Cannot upload marks for other teachers' tests
- **Cannot view test marks uploaded by other teachers**
- **Cannot modify test marks uploaded by other teachers**

❌ **Access Student Fee Information**
- No endpoints for fee data in teacher routes
- Fee management is **ONLY** accessible to Admin role
- Student fee details are completely hidden from teacher dashboard

❌ **Access Admin Functions**
- Cannot create/edit/delete batches
- Cannot create/edit/delete courses
- Cannot manage teachers
- Cannot manage fee records
- All admin operations require `UserRole.ADMIN`

---

## ✅ Frontend Implementation

### Teacher Dashboard Pages

All teacher pages fetch data via authenticated API calls:

1. **AttendanceMarking.jsx**
   ```javascript
   // Fetches ONLY this teacher's batches
   const response = await api.get("/teacher/batches");
   ```

2. **StudentPerformance.jsx**
   ```javascript
   // Fetches ONLY this teacher's batches and tests
   const [batchesRes, testsRes] = await Promise.all([
     api.get("/teacher/batches"),
     api.get("/teacher/tests")
   ]);
   ```

3. **StudyMaterialUpload.jsx**
   ```javascript
   // Will only show materials uploaded by this teacher
   // Data filtered by backend
   ```

4. **TestsAssignments.jsx**
   ```javascript
   // Will only show tests created by this teacher
   // Data filtered by backend
   ```

### JWT Token Authentication

All API calls include the JWT token in the Authorization header:

```javascript
// coaching/src/services/api.js
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
```

---

## 🔍 Example Scenarios

### Scenario 1: Math Teacher vs Science Teacher

**Math Teacher Login:**
- Subject: Mathematics
- Batches: Class 10 Math, Class 12 Math, JEE Math
- Students: Only students enrolled in above batches
- Tests: Only Math tests they created
- Materials: Only Math materials they uploaded
- **Test Marks: Only marks for Math tests (cannot see Science test marks)**

**Science Teacher Login (Same School):**
- Subject: Physics/Chemistry/Biology
- Batches: Class 10 Science, Class 12 Science, JEE Science
- Students: Only students enrolled in above batches
- Tests: Only Science tests they created
- Materials: Only Science materials they uploaded
- **Test Marks: Only marks for Science tests (cannot see Math test marks)**

**Result:**
✅ Math teacher **CANNOT** see any Science teacher's data
✅ Science teacher **CANNOT** see any Math teacher's data
✅ Each teacher sees only their own batches, students, and content
✅ **Math teacher CANNOT see or modify marks uploaded by Science teacher**
✅ **Science teacher CANNOT see or modify marks uploaded by Math teacher**

---

### Scenario 2: Teacher Trying to Access Fees

**Teacher Dashboard:**
- ✅ Attendance marking
- ✅ Upload marks
- ✅ Upload study materials
- ✅ Create tests
- ❌ **NO fee management option**

**If teacher tries to access `/admin/fees` endpoint:**
```python
# Backend returns 403 Forbidden
@router.get("/fees")
async def get_all_fees(
    current_user: User = Depends(require_role(UserRole.ADMIN)),  # Requires ADMIN
    db: Session = Depends(get_db)
):
    # Teacher role will be rejected here
```

**Response:**
```json
{
  "detail": "Access forbidden: insufficient permissions"
}
```

---

## 📊 Database Schema Enforcement

### Teacher-Batch Relationship

```
Table: batches
- id
- name
- code
- course_id
- teacher_id  ← Links batch to ONE teacher
- timing
- days
- max_students
```

**Database enforces:**
- Each batch has exactly ONE teacher
- Teacher can have multiple batches
- Foreign key constraint ensures data integrity

### Security at Database Level

1. **No direct access to database**: Teachers must use API
2. **Foreign key constraints**: Ensure teacher_id is valid
3. **Cascade rules**: Maintain referential integrity
4. **User authentication**: Required before any query

---

## 🧪 Testing Access Control

### Manual Testing Steps:

1. **Login as Teacher A (Math)**
   - Note: batches, students, tests visible
   
2. **Login as Teacher B (Science)**
   - Verify: Different batches, students, tests
   - Verify: No overlap with Teacher A's data

3. **Try accessing admin endpoints**
   - Expected: 403 Forbidden error
   
4. **Try accessing fee endpoints**
   - Expected: 404 Not Found (route doesn't exist for teachers)

### API Endpoint Testing:

```bash
# Get teacher batches (authenticated)
GET /api/teacher/batches
Headers: Authorization: Bearer <teacher_jwt_token>

# Response: Only that teacher's batches
```

```bash
# Try to get all batches (should fail)
GET /api/admin/batches
Headers: Authorization: Bearer <teacher_jwt_token>

# Response: 403 Forbidden
```

---

## 🔐 Security Best Practices Implemented

✅ **Authentication Required**: All endpoints require valid JWT token
✅ **Role-Based Authorization**: RBAC ensures only authorized roles can access endpoints
✅ **Resource-Level Authorization**: Additional checks verify ownership (teacher_id validation)
✅ **Input Validation**: Pydantic schemas validate all inputs
✅ **SQL Injection Protection**: SQLAlchemy ORM prevents SQL injection
✅ **No Direct Database Access**: All queries go through service layer with checks
✅ **Password Hashing**: Bcrypt used for secure password storage
✅ **Token Expiration**: JWT tokens have expiration time
✅ **CORS Configuration**: Only allowed origins can access API

---

## 📝 Summary

### Teacher Access Control Matrix

| Resource | Can View | Can Create | Can Edit | Can Delete |
|----------|----------|------------|----------|------------|
| **Own Batches** | ✅ | ❌ | ❌ | ❌ |
| **Other Teacher's Batches** | ❌ | ❌ | ❌ | ❌ |
| **Own Students** | ✅ | ❌ | ❌ | ❌ |
| **Other Teacher's Students** | ❌ | ❌ | ❌ | ❌ |
| **Own Tests** | ✅ | ✅ | ✅ | ❌ |
| **Other Teacher's Tests** | ❌ | ❌ | ❌ | ❌ |
| **Own Test Marks** | ✅ | ✅ | ✅ | ❌ |
| **Other Teacher's Test Marks** | ❌ | ❌ | ❌ | ❌ |
| **Own Study Materials** | ✅ | ✅ | ❌ | ✅ |
| **Other Teacher's Materials** | ❌ | ❌ | ❌ | ❌ |
| **Attendance (Own Batches)** | ✅ | ✅ | ❌ | ❌ |
| **Attendance (Other Batches)** | ❌ | ❌ | ❌ | ❌ |
| **Student Fees** | ❌ | ❌ | ❌ | ❌ |
| **Admin Functions** | ❌ | ❌ | ❌ | ❌ |

### Key Takeaways:

1. **Complete Data Isolation**: Teachers can only access their own data
2. **No Fee Access**: Fee information is completely hidden from teachers
3. **Backend Enforced**: Security is implemented at API level, not just UI
4. **Multi-Layer Protection**: Authentication + Authorization + Resource ownership checks
5. **Real-Time Filtering**: All queries automatically filter by teacher_id
6. **Test Marks Isolation**: Teachers can only view/modify marks for their own tests

---

## 🎯 Conclusion

The application implements **comprehensive access control** ensuring:

✅ **Math teachers cannot see Science teacher's data**
✅ **Science teachers cannot see Math teacher's data**  
✅ **NO teacher can see student fee information**
✅ **Each teacher sees only their own batches, students, tests, and materials**
✅ **Teachers can only view/modify test marks for their own tests**
✅ **Math teacher cannot see/modify marks uploaded by Science teacher**
✅ **Backend enforces all security rules - cannot be bypassed from frontend**

This ensures **complete data privacy and security** for multi-teacher environments.
