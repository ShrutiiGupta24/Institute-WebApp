from app.database import SessionLocal
from app.models.test import Test
from app.models.batch import Batch
from app.models.course import Course

db = SessionLocal()

print('=' * 60)
print('HOW TEST-TO-STUDENT MAPPING WORKS')
print('=' * 60)

# Get a test
test = db.query(Test).filter(Test.id == 2).first()
print(f'\n1. TEST SELECTED: "{test.title}"')
print(f'   - Test ID: {test.id}')
print(f'   - Course ID: {test.course_id}')

# Get the course
if test.course_id:
    course = db.query(Course).filter(Course.id == test.course_id).first()
    print(f'   - Course Name: {course.name if course else "Unknown"}')

# Find all batches for this course
batches = db.query(Batch).filter(Batch.course_id == test.course_id).all()
print(f'\n2. BATCHES FOR THIS COURSE (course_id={test.course_id}):')
print(f'   Found {len(batches)} batch(es)')

all_students = []
for batch in batches:
    print(f'\n   Batch: {batch.name} ({batch.code})')
    print(f'   - Teacher ID: {batch.teacher_id}')
    print(f'   - Students enrolled: {len(batch.students)}')
    for student in batch.students:
        print(f'      • Student ID {student.id}: {student.user.full_name if student.user else "No name"}')
        all_students.append({
            'id': student.id,
            'name': student.user.full_name if student.user else "No name",
            'batch': batch.name
        })

print(f'\n3. TOTAL STUDENTS WHO SHOULD SEE THIS TEST:')
print(f'   {len(all_students)} student(s)')
for s in all_students:
    print(f'   - {s["name"]} (from {s["batch"]})')

print('\n' + '=' * 60)
print('CONCLUSION:')
print('=' * 60)
print('• Tests are linked to Courses via course_id')
print('• Batches are also linked to Courses via course_id')  
print('• Students are enrolled in Batches')
print('• To find students for a test:')
print('  1. Get test.course_id')
print('  2. Find all batches with that course_id')
print('  3. Get all students from those batches')
print('=' * 60)

db.close()
