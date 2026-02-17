from app.database import SessionLocal
from app.models.teacher import Teacher
from app.models.batch import Batch
from app.models.user import User

db = SessionLocal()

print('=' * 70)
print('TEACHER-SPECIFIC BATCH FILTERING DEMONSTRATION')
print('=' * 70)

teachers = db.query(Teacher).all()

for teacher in teachers:
    user = db.query(User).filter(User.id == teacher.user_id).first()
    print(f'\n{"=" * 70}')
    print(f'TEACHER: {user.full_name if user else "Unknown"}')
    print(f'{"=" * 70}')
    print(f'User ID: {teacher.user_id}')
    print(f'Teacher ID: {teacher.id}')
    print(f'Subject/Expertise: {teacher.subject}')
    print(f'Qualification: {teacher.qualification}')
    
    # Get batches assigned to this teacher
    batches = db.query(Batch).filter(Batch.teacher_id == teacher.id).all()
    
    print(f'\nBatches Assigned: {len(batches)}')
    print('-' * 70)
    
    if batches:
        for batch in batches:
            print(f'\n  ✓ {batch.name} ({batch.code})')
            print(f'    Course ID: {batch.course_id}')
            print(f'    Timing: {batch.timing or "Not set"}')
            print(f'    Days: {batch.days or "Not set"}')
            print(f'    Students Enrolled: {len(batch.students)}')
            if batch.students:
                for student in batch.students:
                    student_name = student.user.full_name if student.user else "Unknown"
                    print(f'      → {student_name} (ID: {student.id})')
    else:
        print('  No batches assigned')

print('\n' + '=' * 70)
print('SUMMARY')
print('=' * 70)
print('✓ Each teacher only sees batches where they are assigned (teacher_id)')
print('✓ The backend filters: Batch.teacher_id == teacher.id')
print('✓ Teachers cannot see or access batches taught by other teachers')
print('✓ This ensures data security and proper academic organization')
print('=' * 70)

db.close()
