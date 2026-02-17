from app.database import SessionLocal
from app.models.batch import Batch
from app.models.test import Test

db = SessionLocal()

print('=== BATCH-TEST MATCHING ===')
batches = db.query(Batch).all()
tests = db.query(Test).all()

print(f'\nTotal Batches: {len(batches)}')
print(f'Total Tests: {len(tests)}\n')

for batch in batches:
    print(f'Batch: {batch.name} ({batch.code})')
    print(f'  Course ID: {batch.course_id}')
    print(f'  Teacher ID: {batch.teacher_id}')
    print(f'  Students: {len(batch.students)}')
    matching_tests = [t for t in tests if t.course_id == batch.course_id]
    print(f'  Matching Tests: {len(matching_tests)}')
    for t in matching_tests:
        print(f'    - {t.title}')
    print()

db.close()
