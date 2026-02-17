# Teacher Marks Upload - Database Integration

## Overview
The Teacher Marks Upload feature has been successfully integrated with the database. Teachers can now:
1. Select a batch they're teaching
2. Either select an existing test or create a new one
3. Enter marks for students in that batch
4. Upload marks to the database
5. View statistics (uploaded count, average, highest, lowest)

## Backend Implementation

### 1. Schema (backend/app/schemas/teacher.py)
Added bulk upload schema:
```python
class TestEvaluation(BaseModel):
    student_id: int
    marks_obtained: float
    remarks: Optional[str] = None

class BulkTestResultCreate(BaseModel):
    test_id: int
    results: List[TestEvaluation]
```

### 2. Service (backend/app/services/teacher_service.py)
#### Key Functions:
- **get_teacher_batches()**: Returns batches with enrolled students
- **get_teacher_tests()**: Returns tests created by the teacher
- **create_test()**: Creates a new test with course_id, total_marks, passing_marks, test_date
- **upload_test_results()**: Bulk uploads/updates test results
  - Handles both create and update scenarios
  - Calculates percentage automatically
  - Sets evaluated_at timestamp

### 3. Routes (backend/app/routes/teacher.py)
Added endpoints:
- `GET /teacher/batches` - Get teacher's assigned batches with students
- `GET /teacher/tests` - Get teacher's created tests
- `POST /teacher/tests` - Create a new test
- `POST /teacher/tests/{test_id}/results` - Upload marks for multiple students

## Frontend Implementation

### File: coaching/src/pages/teacher/StudentPerformance.jsx

#### State Management:
- `batches`: List of teacher's assigned batches
- `tests`: List of available tests
- `selectedBatch`: Currently selected batch
- `selectedTest`: Currently selected test
- `showCreateTest`: Toggle between test selection and creation
- `marks`: Object storing student_id -> marks_obtained mapping
- `loading`, `saving`, `error`: UI states

#### Flow:
1. **Batch Selection**
   - Displays all assigned batches as cards
   - Shows batch name, code, student count, timing

2. **Test Selection/Creation**
   - Option 1: Select existing test (filtered by batch's course)
   - Option 2: Create new test (enter name, total marks, date)

3. **Marks Entry**
   - Lists all students in the batch
   - Input field for each student's marks
   - Validates marks don't exceed total_marks
   - Shows percentage for entered marks

4. **Statistics**
   - Uploaded count
   - Average marks
   - Highest marks
   - Lowest marks

5. **Save**
   - Uploads all entered marks via POST request
   - Shows success message
   - Auto-hides after 3 seconds

## API Integration

### Fetch Batches and Tests (on mount):
```javascript
const [batchesRes, testsRes] = await Promise.all([
  api.get("/teacher/batches"),
  api.get("/teacher/tests")
]);
```

### Create Test:
```javascript
const response = await api.post("/teacher/tests", {
  title: testName,
  course_id: selectedBatch.course_id,
  total_marks: totalMarks,
  passing_marks: Math.floor(totalMarks * 0.4),
  test_date: new Date(testDate).toISOString()
});
```

### Upload Marks:
```javascript
const payload = {
  test_id: selectedTest.id,
  results: Object.entries(marks).map(([studentId, marksObtained]) => ({
    student_id: parseInt(studentId),
    marks_obtained: marksObtained,
    remarks: null
  }))
};

await api.post(`/teacher/tests/${selectedTest.id}/results`, payload);
```

## Database Schema

### Test Table:
- `id`: Primary key
- `title`: Test name
- `description`: Optional description
- `course_id`: Foreign key to Course
- `total_marks`: Maximum marks
- `passing_marks`: Minimum passing marks
- `duration_minutes`: Optional test duration
- `test_date`: Date of test
- `created_by`: Foreign key to User (teacher)

### TestResult Table:
- `id`: Primary key
- `test_id`: Foreign key to Test
- `student_id`: Foreign key to Student
- `marks_obtained`: Marks scored
- `percentage`: Auto-calculated percentage
- `grade`: Optional grade
- `remarks`: Optional teacher remarks
- `evaluated_at`: Timestamp of evaluation
- `submitted_at`: When student submitted (optional)

## Key Features

1. **Dynamic Test Selection**: Tests are filtered by the batch's course_id
2. **Bulk Upload**: Upload marks for multiple students in one request
3. **Update Capability**: Can update marks if already uploaded (service handles upsert)
4. **Validation**: Marks cannot exceed total_marks
5. **Real-time Statistics**: Shows upload progress and statistics
6. **Error Handling**: Displays errors from API with user-friendly messages

## Testing Steps

1. Login as a teacher
2. Navigate to "Upload Student Marks"
3. Select a batch you're teaching
4. Either:
   - Select an existing test, OR
   - Click "Create New Test" and fill in details
5. Enter marks for students
6. Click "Upload Marks"
7. Verify success message
8. Check student dashboard to see if marks are visible

## Notes

- Teachers can only see batches assigned to them
- Tests are course-specific (linked via course_id)
- Students can view their marks in the "Test Results" tab
- Marks can be updated by re-uploading (service handles updates)
- Percentage is auto-calculated: (marks_obtained / total_marks) * 100
