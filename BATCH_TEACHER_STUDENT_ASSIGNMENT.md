# Batch-Teacher-Student Assignment System

## Overview
This document explains how batch assignments work in the Institute Management System and how changes made by admins automatically reflect in teacher and student dashboards.

---

## 🎯 System Architecture

### Database Relationships

```
Admin → Creates/Edits Batch → Assigns Teacher → Students Enroll
                ↓
          teacher_id stored in Batch
                ↓
    Automatically visible to assigned teacher
```

**Tables Involved:**
1. **batches** - Core table linking everything
   - `id`: Batch identifier
   - `name`: Batch name (e.g., "Batch A")
   - `code`: Class identifier (e.g., "9", "12", "JEE")
   - `course_id`: Links to courses table
   - **`teacher_id`**: Links to teachers table (KEY FIELD)
   - `timing`: Batch schedule
   - `days`: Days of the week
   - `max_students`: Capacity

2. **teachers** - Teacher information
   - `id`: Teacher identifier
   - `user_id`: Links to users table
   - `subject`: Teacher's subject expertise
   - Relationship: `batches = relationship("Batch", back_populates="teacher")`

3. **students** - Student information
   - `id`: Student identifier
   - `user_id`: Links to users table
   - `batch`: Batch code student is enrolled in
   - Relationship with batches through `batch` field

---

## 📊 Admin Batch Management

### Creating a Batch

**Admin Dashboard → Batch Management → Create New Batch**

**Form Fields:**
- **Batch Name**: e.g., "Batch A", "Morning Batch"
- **Subject/Course**: e.g., "Mathematics", "Physics"
- **Assign Teacher**: Dropdown showing all teachers with their subject
  ```
  -- Select Teacher --
  Sudhanshu Shekhar (Mathematics)
  Rajesh Kumar (Physics)
  Priya Sharma (Chemistry)
  ```
- **Timing**: e.g., "8:00 AM - 10:00 AM"
- **Days**: e.g., "Mon, Wed, Fri"
- **Maximum Capacity**: e.g., 30

**Backend Process:**
```python
POST /api/admin/batches
{
  "name": "Batch A",
  "code": "12",
  "course_id": 5,
  "teacher_id": 10,  # ← Assigned teacher
  "timing": "8:00 AM - 10:00 AM",
  "days": "Mon, Wed, Fri",
  "max_students": 30
}
```

### Editing a Batch

**Admin can:**
- Change batch name
- Change timing/days
- **Reassign to different teacher** (changes `teacher_id`)
- Modify capacity

**Backend Process:**
```python
PUT /api/admin/batches/{batch_id}
{
  "teacher_id": 15  # ← Changed from teacher 10 to teacher 15
}
```

**Result:**
- Old teacher (10) will NO LONGER see this batch
- New teacher (15) will NOW see this batch
- **Automatic real-time reflection** when they refresh/reload

---

## 👨‍🏫 Teacher Dashboard Reflection

### How Teachers See Their Batches

**Endpoint:** `GET /api/teacher/batches`

**Backend Filtering:**
```python
def get_teacher_batches(self, user_id: int):
    teacher = db.query(Teacher).filter(Teacher.user_id == user_id).first()
    
    # AUTOMATIC FILTERING by teacher_id
    batches = db.query(Batch).filter(Batch.teacher_id == teacher.id).all()
    
    return batches  # Only batches assigned to THIS teacher
```

### What Teachers See

**Teacher Dashboard → Attendance/Marks/Materials**

**Math Teacher (ID: 10) sees:**
```
Available Batches:
✓ Class 12 - Batch A (Mathematics) - Mon, Wed, Fri - 8:00 AM
✓ Class 11 - Batch B (Mathematics) - Tue, Thu - 10:00 AM
✓ JEE - Batch Advanced (Mathematics) - Daily - 2:00 PM
```

**Physics Teacher (ID: 15) sees:**
```
Available Batches:
✓ Class 12 - Batch C (Physics) - Mon, Wed, Fri - 10:00 AM
✓ Class 11 - Batch D (Physics) - Tue, Thu, Sat - 8:00 AM
```

**Note:** Each teacher only sees batches where `batch.teacher_id == their_id`

### Automatic Updates

**Scenario: Admin reassigns "Class 12 - Batch A" from Math Teacher to Physics Teacher**

**Before:**
- Math Teacher: sees "Class 12 - Batch A"
- Physics Teacher: doesn't see it

**After (immediately upon refresh):**
- Math Teacher: no longer sees "Class 12 - Batch A"
- Physics Teacher: now sees "Class 12 - Batch A"

**No manual intervention needed!**

---

## 👨‍🎓 Student Dashboard Reflection

### How Students See Their Batches

**Student Enrollment Process:**
1. Admin creates batch with teacher assigned
2. Admin enrolls student in batch (assigns `batch` code to student)
3. Student automatically sees:
   - Their batch details
   - Assigned teacher name
   - Batch timing and schedule

**Endpoint:** Student dashboard fetches batches based on enrolled `batch` code

### What Students See

**Student Dashboard:**

**Student "Rahul" enrolled in batch code "12-A":**
```
My Batch Information:
- Batch: Class 12 - Batch A
- Subject: Mathematics
- Teacher: Sudhanshu Shekhar  ← Automatically shows assigned teacher
- Timing: 8:00 AM - 10:00 AM
- Days: Mon, Wed, Fri
```

**Student "Priya" enrolled in batch code "12-C":**
```
My Batch Information:
- Batch: Class 12 - Batch C
- Subject: Physics
- Teacher: Rajesh Kumar  ← Different teacher
- Timing: 10:00 AM - 12:00 PM
- Days: Tue, Thu, Sat
```

### Available Tests Tab

**Student Dashboard → Tests & Assignments**

Shows tests created by **their batch's assigned teacher** for their course:

```
Available Tests:
✓ Math Unit Test 1 - By Sudhanshu Shekhar (Their teacher)
✓ Math Mid-Term - By Sudhanshu Shekhar
✗ Physics Test - NOT shown (different teacher/course)
```

**Backend Filtering:**
```python
def get_available_tests(self, user_id: int):
    student = db.query(Student).filter(Student.user_id == user_id).first()
    
    # Get student's enrolled batches
    batches = db.query(Batch).filter(Batch.code == student.batch).all()
    course_ids = [batch.course_id for batch in batches]
    
    # Get tests for those courses (created by respective teachers)
    tests = db.query(Test).filter(Test.course_id.in_(course_ids)).all()
    
    return tests  # Shows teacher name who created the test
```

---

## 🔄 Data Flow Example

### Complete Flow: Admin → Teacher → Student

**Step 1: Admin Creates Batch**
```
Admin Dashboard → Batch Management → Create Batch
- Name: "Morning Batch"
- Class: 12
- Subject: Mathematics
- Teacher: Sudhanshu Shekhar (ID: 10)
- Timing: 8:00 AM - 10:00 AM
```

**Database Entry:**
```sql
INSERT INTO batches (name, code, course_id, teacher_id, timing, days)
VALUES ('Morning Batch', '12', 5, 10, '8:00 AM - 10:00 AM', 'Mon, Wed, Fri');
```

**Step 2: Teacher Logs In**
```
Teacher (Sudhanshu) → Teacher Dashboard
- API Call: GET /teacher/batches
- Backend filters: WHERE teacher_id = 10
- Result: "Morning Batch" appears in teacher's batch list
```

**Step 3: Admin Enrolls Student**
```
Admin → Student Management → Edit Student → Assign Batch
- Student: Rahul
- Batch: Morning Batch (code: 12)
```

**Database Update:**
```sql
UPDATE students SET batch = '12' WHERE id = 100;
```

**Step 4: Student Logs In**
```
Student (Rahul) → Student Dashboard
- Shows batch: "Morning Batch"
- Shows teacher: "Sudhanshu Shekhar"
- Shows tests created by Sudhanshu for Class 12 Math
```

---

## 🔄 Reassignment Scenario

### Changing Teacher Assignment

**Initial State:**
```
Batch: "Class 12 - Batch A"
Teacher: Sudhanshu (Math) - ID: 10
Students: Rahul, Priya, Amit (30 students)
```

**Admin Action:**
```
Admin → Batch Management → Edit "Class 12 - Batch A"
- Change Teacher: Rajesh Kumar (Physics) - ID: 15
- Click Update
```

**Database Update:**
```sql
UPDATE batches 
SET teacher_id = 15 
WHERE id = 1;
```

**Immediate Effects:**

**1. Sudhanshu (Old Teacher):**
- Logs out and back in → "Class 12 - Batch A" no longer appears
- Cannot mark attendance for these students
- Cannot upload marks for these students
- **Complete isolation** from this batch

**2. Rajesh (New Teacher):**
- Logs out and back in → "Class 12 - Batch A" now appears
- Can mark attendance for all 30 students
- Can create tests and upload marks
- **Full access** to this batch

**3. Students (Rahul, Priya, Amit):**
- Dashboard now shows: "Teacher: Rajesh Kumar"
- See tests created by Rajesh
- No longer see Sudhanshu's tests for this batch
- Batch timing/days remain same

---

## 🔐 Security & Access Control

### Teacher Isolation

**Rule:** Teachers can ONLY see/access batches where `batch.teacher_id == their_id`

**Enforced at:**
1. **Database Query Level** - All queries filter by teacher_id
2. **API Level** - Endpoints validate teacher ownership
3. **Frontend Level** - UI only shows teacher's data

**Example:**
```python
# Math teacher tries to access Physics batch
GET /teacher/batches
Response: [
  # Only Math batches, Physics batches NOT included
]

# Math teacher tries to mark attendance for Physics batch
POST /teacher/attendance
{
  "batch_id": 15  # Physics batch
}
Response: 400 Bad Request
Error: "Unauthorized to mark attendance for this batch"
```

### Student Data Access

**Students can only see:**
- Their own enrolled batch
- Teacher assigned to their batch
- Tests/materials from their batch's teacher
- Attendance/marks for themselves only

**Cannot see:**
- Other students' marks
- Other batches
- Other teachers' data
- Fee information of others

---

## 📱 Real-Time Reflection

### When Changes Reflect

**Admin makes change → Save**

**Immediate (next page load):**
- ✅ Teacher dashboard (after refresh)
- ✅ Student dashboard (after refresh)
- ✅ Batch lists
- ✅ Student enrollment

**Automatic (no extra steps):**
- ✅ Teacher sees only their batches
- ✅ Students see correct teacher name
- ✅ Tests filtered by teacher
- ✅ Attendance/marks linked to teacher

**No manual sync needed** - All relationships handled by database foreign keys and backend queries.

---

## ✅ Summary

| Action | Admin | Teacher | Student |
|--------|-------|---------|---------|
| **Create Batch** | ✅ Assigns teacher | ❌ | ❌ |
| **View Assigned Batch** | ✅ All batches | ✅ Only their batches | ✅ Only enrolled batch |
| **Change Teacher** | ✅ Can reassign | ❌ | ❌ |
| **See Teacher Name** | ✅ | ✅ | ✅ |
| **Mark Attendance** | ✅ | ✅ (own batches) | ❌ |
| **Upload Marks** | ✅ | ✅ (own batches) | ❌ |
| **View Marks** | ✅ | ✅ (own tests) | ✅ (own marks) |

---

## 🎯 Key Points

1. **Single Source of Truth**: `batches.teacher_id` field
2. **Automatic Filtering**: Backend always filters by teacher_id
3. **Immediate Reflection**: Changes visible on next login/refresh
4. **Complete Isolation**: Teachers can't access other teachers' data
5. **Student Visibility**: Students see their batch's assigned teacher
6. **No Manual Sync**: Everything handled automatically by relationships

**The system is fully integrated and changes flow automatically from Admin → Teacher → Student!**
