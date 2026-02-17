# How the System Determines Which Students to Show for a Test

## Database Structure

```
Course (e.g., "Mathematics")
   ├─ course_id: 2
   │
   ├─ Test "Mid-Term Exam"
   │   └─ course_id: 2  ← Links to course
   │
   └─ Batches
       ├─ Batch A (code: 9)
       │   ├─ course_id: 2  ← Links to same course
       │   └─ Students: [Riya]
       │
       └─ Batch B (code: 15)
           ├─ course_id: 2  ← Links to same course
           └─ Students: [John, Sarah]
```

## Logic Flow

### Step 1: Test is Selected
```javascript
selectedTest = {
  id: 2,
  title: "Mid-Term Exam",
  course_id: 2,  // ← This is the key!
  total_marks: 100
}
```

### Step 2: Find ALL Batches with Matching Course
```javascript
matchingBatches = batches.filter(batch => 
  batch.course_id === selectedTest.course_id
)
// Result: [Batch A, Batch B]
```

### Step 3: Get ALL Students from Those Batches
```javascript
students = matchingBatches.flatMap(batch => 
  batch.students.map(student => ({
    ...student,
    batchName: batch.name,  // Include batch info
    batchCode: batch.code
  }))
)
// Result: [
//   { id: 1, name: "Riya", batchName: "Batch A" },
//   { id: 5, name: "John", batchName: "Batch B" },
//   { id: 7, name: "Sarah", batchName: "Batch B" }
// ]
```

### Step 4: Remove Duplicates (if student is in multiple batches)
```javascript
uniqueStudents = students.filter((student, index, self) => 
  index === self.findIndex(s => s.id === student.id)
)
```

## Real Example from Your Database

**Test: "Mid-Term Exam"**
- course_id = 2

**Batches with course_id = 2:**
- Batch A (code: 9) → 1 student (Riya)

**Students Shown:**
- Riya (from Batch A)

**Why Other Batches Don't Show:**
- Batch "SST" (code: 12) → course_id = 6 ✗ (doesn't match)
- Batch "Chemistry" (code: 10) → course_id = 5 ✗ (doesn't match)

## UI Display

When teacher selects "Mid-Term Exam":
```
✓ Selected Test: Mid-Term Exam
  Total Marks: 100
  Students: 1 (from all batches with matching course)

Students List:
┌─────────────────────────────────────────┐
│ 1  Riya                                 │
│    Student ID: 1 • Batch: Batch A      │
│    Marks: [__] out of 100              │
└─────────────────────────────────────────┘
```

## Key Points

1. **Course is the Link**: Tests and Batches are linked through `course_id`
2. **Automatic Filtering**: System automatically finds all relevant students
3. **Cross-Batch**: Students from ALL batches with matching course are shown
4. **No Manual Selection**: Teacher doesn't need to pick which students - system knows
5. **Batch Visibility**: Each student shows which batch they belong to

## What Happens If...

### No Matching Students?
```
⚠ No students found for this test. 
  There are no students enrolled in batches that match this test's course.
```

### Student in Multiple Batches?
- Deduplication logic ensures student appears only once
- Shows batch from first occurrence

### Different Course?
- Test with course_id = 2 won't show students from batches with course_id = 5 or 6
- This ensures proper academic organization
