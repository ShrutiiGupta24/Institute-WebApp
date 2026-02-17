# 🔒 Test Marks Security - Teacher Isolation

## Overview
This document explains how test marks are completely isolated between teachers. Teachers can only view and modify marks for tests they created themselves.

---

## 🎯 Security Objective

**Prevent teachers from:**
- Viewing test marks uploaded by other teachers
- Modifying test marks uploaded by other teachers
- Accessing student performance data for tests they didn't create

---

## 🛡️ Implementation Details

### 1. Viewing Student Performance

**Endpoint:** `GET /api/teacher/students/performance/{student_id}`

**Security Implementation:**
```python
def get_student_performance(self, user_id: int, student_id: int):
    """Get performance report - ONLY showing this teacher's test results"""
    teacher = self.db.query(Teacher).filter(Teacher.user_id == user_id).first()
    
    # Verify student is in teacher's batch
    teacher_batch_ids = [batch.id for batch in teacher.batches]
    student_in_teacher_batch = any(batch.id in teacher_batch_ids for batch in student.batches)
    
    if not student_in_teacher_batch:
        raise ValueError("Unauthorized - Student not in your batches")
    
    # CRITICAL: Filter test results by teacher_id
    test_results = self.db.query(TestResult).join(Test).filter(
        TestResult.student_id == student_id,
        Test.teacher_id == teacher.id  # ← Only this teacher's tests
    ).all()
    
    return {
        "student_id": student_id,
        "student_name": student.user.full_name,
        "test_results": test_results  # Only marks from teacher's tests
    }
```

**What this means:**
- Math teacher viewing Student A's performance → sees only Math test marks
- Science teacher viewing Student A's performance → sees only Science test marks
- **Same student, different marks shown to different teachers**

---

### 2. Modifying Test Marks

**Endpoint:** `POST /api/teacher/tests/{test_id}/evaluate`

**Security Implementation:**
```python
def evaluate_test(self, user_id: int, test_id: int, evaluation: TestEvaluation):
    """Evaluate a student's test - ONLY for tests created by this teacher"""
    teacher = self.db.query(Teacher).filter(Teacher.user_id == user_id).first()
    
    # CRITICAL: Verify test ownership
    test = self.db.query(Test).filter(Test.id == test_id).first()
    if not test or test.teacher_id != teacher.id:
        raise ValueError("Test not found or unauthorized - You can only modify your own test results")
    
    # Proceed with modification only if ownership verified
    result = self.db.query(TestResult).filter(
        TestResult.test_id == test_id,
        TestResult.student_id == evaluation.student_id
    ).first()
    
    result.marks_obtained = evaluation.marks_obtained
    result.remarks = evaluation.remarks
    
    self.db.commit()
    return result
```

**What this means:**
- Math teacher can modify Math test marks ✅
- Math teacher trying to modify Science test marks ❌ → ERROR
- Science teacher can modify Science test marks ✅
- Science teacher trying to modify Math test marks ❌ → ERROR

---

### 3. Uploading Test Results

**Endpoint:** `POST /api/teacher/tests/{test_id}/results`

**Security Implementation:**
```python
def upload_test_results(self, user_id: int, test_id: int, results_data: List):
    """Upload test results - ONLY for tests created by this teacher"""
    teacher = self.db.query(Teacher).filter(Teacher.user_id == user_id).first()
    
    # CRITICAL: Verify test ownership before upload
    test = self.db.query(Test).filter(Test.id == test_id).first()
    if not test or test.teacher_id != teacher.id:
        raise ValueError("Test not found or unauthorized")
    
    # Upload marks only if ownership verified
    for result_data in results_data:
        result = TestResult(
            test_id=test_id,
            student_id=result_data.student_id,
            marks_obtained=result_data.marks_obtained,
            # ...
        )
        self.db.add(result)
    
    self.db.commit()
    return results
```

---

## 📊 Real-World Example

### Scenario: Student "Rahul" takes both Math and Science tests

**Database State:**
```
Tests Table:
id | title          | teacher_id | course_id
1  | Math Unit 1    | 10 (Math Teacher)   | 1
2  | Science Mid    | 20 (Science Teacher)| 2

Test Results Table:
id | test_id | student_id | marks_obtained
1  | 1       | 100        | 85 (Math)
2  | 2       | 100        | 92 (Science)
```

**Math Teacher Access:**
```bash
# Math teacher views Rahul's performance
GET /api/teacher/students/performance/100

Response:
{
  "student_name": "Rahul",
  "test_results": [
    {
      "test_id": 1,
      "title": "Math Unit 1",
      "marks_obtained": 85  ← Only Math test visible
    }
    # Science test (id=2) NOT shown
  ]
}
```

**Science Teacher Access:**
```bash
# Science teacher views Rahul's performance
GET /api/teacher/students/performance/100

Response:
{
  "student_name": "Rahul",
  "test_results": [
    {
      "test_id": 2,
      "title": "Science Mid",
      "marks_obtained": 92  ← Only Science test visible
    }
    # Math test (id=1) NOT shown
  ]
}
```

**Cross-Teacher Modification Attempt:**
```bash
# Math teacher tries to modify Science test marks
POST /api/teacher/tests/2/evaluate
Headers: Authorization: Bearer <math_teacher_token>
Body: {"student_id": 100, "marks_obtained": 50}

Response: 400 Bad Request
{
  "detail": "Test not found or unauthorized - You can only modify your own test results"
}
```

---

## 🔐 Database Query Logic

### Query Without Security (WRONG - Shows all marks):
```python
# ❌ INSECURE - Shows all test marks regardless of teacher
test_results = db.query(TestResult).filter(
    TestResult.student_id == student_id
).all()
```

### Query With Security (CORRECT - Filters by teacher):
```python
# ✅ SECURE - Shows only teacher's test marks
test_results = db.query(TestResult).join(Test).filter(
    TestResult.student_id == student_id,
    Test.teacher_id == teacher.id  # Filter by teacher
).all()
```

**The JOIN with Test table is critical** - it allows filtering by `teacher_id` column in the `tests` table.

---

## 🧪 Testing the Security

### Test 1: View Student Performance
```python
# Login as Math Teacher
math_token = login("math_teacher@school.com", "password")

# View student performance
response = api.get(
    "/teacher/students/performance/100",
    headers={"Authorization": f"Bearer {math_token}"}
)

# Verify: Only Math test results shown
assert all(result["test"]["teacher_id"] == math_teacher_id 
           for result in response["test_results"])
```

### Test 2: Attempt Cross-Teacher Modification
```python
# Login as Math Teacher
math_token = login("math_teacher@school.com", "password")

# Try to modify Science test marks
response = api.post(
    "/teacher/tests/2/evaluate",  # Science test ID
    headers={"Authorization": f"Bearer {math_token}"},
    json={"student_id": 100, "marks_obtained": 50}
)

# Verify: Request rejected with 400 error
assert response.status_code == 400
assert "unauthorized" in response.json()["detail"].lower()
```

### Test 3: Upload Marks for Own Test
```python
# Login as Math Teacher
math_token = login("math_teacher@school.com", "password")

# Upload marks for Math test (should succeed)
response = api.post(
    "/teacher/tests/1/results",  # Math test ID
    headers={"Authorization": f"Bearer {math_token}"},
    json={"results": [{"student_id": 100, "marks_obtained": 85}]}
)

# Verify: Success
assert response.status_code == 200
```

---

## 📋 Security Checklist

- [x] Test results filtered by teacher_id when viewing
- [x] Test ownership verified before modification
- [x] Test ownership verified before upload
- [x] Authorization errors return clear messages
- [x] Student must be in teacher's batch to view performance
- [x] Attendance filtered by teacher's batches
- [x] Database queries use JOIN to filter by teacher
- [x] Frontend fetches data via authenticated API
- [x] No direct database access from frontend
- [x] JWT tokens required for all requests

---

## 🎯 Access Control Summary

### Math Teacher Can:
- ✅ View marks for Math tests
- ✅ Upload marks for Math tests
- ✅ Modify marks for Math tests
- ✅ See student performance in Math

### Math Teacher CANNOT:
- ❌ View marks for Science tests
- ❌ Upload marks for Science tests
- ❌ Modify marks for Science tests
- ❌ See Science test results in student performance

### Science Teacher Can:
- ✅ View marks for Science tests
- ✅ Upload marks for Science tests
- ✅ Modify marks for Science tests
- ✅ See student performance in Science

### Science Teacher CANNOT:
- ❌ View marks for Math tests
- ❌ Upload marks for Math tests
- ❌ Modify marks for Math tests
- ❌ See Math test results in student performance

---

## 🔒 Multi-Layer Security

### Layer 1: Authentication
- JWT token required for all requests
- Token identifies the user and their role

### Layer 2: Role-Based Authorization
- Only `UserRole.TEACHER` can access teacher endpoints
- Admins and students are rejected

### Layer 3: Resource Ownership
- Additional check: `test.teacher_id == teacher.id`
- Prevents cross-teacher access

### Layer 4: Database Filtering
- All queries automatically filter by teacher_id
- JOIN with Test table ensures proper filtering

---

## ✅ Result

**Complete test marks isolation achieved!**

- Math teacher sees ONLY Math test marks
- Science teacher sees ONLY Science test marks
- English teacher sees ONLY English test marks
- No teacher can view or modify other teachers' test marks
- Backend enforces all security rules
- Cannot be bypassed from frontend or API

**The system is secure for multi-teacher environments!**
