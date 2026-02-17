from app.database import SessionLocal
from app.models.student import Student
from app.models.test import Test, TestResult
from app.models.course import Course

db = SessionLocal()

print('=' * 70)
print('STUDENT TEST/ASSIGNMENT VIEW DEMONSTRATION')
print('=' * 70)

# Get a student
student = db.query(Student).first()
if not student:
    print("No students found in database")
    db.close()
    exit()

print(f'\nSTUDENT: {student.user.full_name if student.user else "Unknown"}')
print(f'Student ID: {student.id}')

# Get enrolled batches and courses
student_batches = student.batches if hasattr(student, 'batches') else []
course_ids = [b.course_id for b in student_batches if b.course_id]

print(f'\nEnrolled Batches: {len(student_batches)}')
for batch in student_batches:
    course = db.query(Course).filter(Course.id == batch.course_id).first()
    print(f'  - {batch.name} ({batch.code}) → Course: {course.name if course else "N/A"}')

print(f'\nCourse IDs: {course_ids}')

# Get available tests
tests = db.query(Test).filter(
    Test.course_id.in_(course_ids) if course_ids else False
).all()

print(f'\n{"=" * 70}')
print(f'AVAILABLE TESTS/ASSIGNMENTS: {len(tests)}')
print('=' * 70)

if tests:
    for test in tests:
        # Check completion status
        result = db.query(TestResult).filter(
            TestResult.test_id == test.id,
            TestResult.student_id == student.id
        ).first()
        
        course = db.query(Course).filter(Course.id == test.course_id).first()
        
        print(f'\n📝 {test.title}')
        print(f'   Course: {course.name if course else "General"}')
        print(f'   Total Marks: {test.total_marks}')
        print(f'   Passing Marks: {test.passing_marks}')
        if test.test_date:
            print(f'   Date: {test.test_date.strftime("%Y-%m-%d")}')
        print(f'   Teacher: {test.teacher.user.full_name if test.teacher and test.teacher.user else "Admin"}')
        
        if result:
            print(f'   ✅ COMPLETED')
            print(f'   Marks Obtained: {result.marks_obtained}/{test.total_marks}')
            print(f'   Percentage: {result.percentage}%')
        else:
            print(f'   ⏳ PENDING')
else:
    print('\nNo tests available for enrolled courses')

print('\n' + '=' * 70)
print('SUMMARY')
print('=' * 70)
print('✓ Students see tests from ALL enrolled courses')
print('✓ Tests show completion status (Completed/Pending)')
print('✓ Completed tests show marks and percentage')
print('✓ Students can filter: All, Pending, Completed')
print('=' * 70)

db.close()
