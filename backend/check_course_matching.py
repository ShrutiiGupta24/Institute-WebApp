from app.database import SessionLocal
from app.models.batch import Batch
from app.models.test import Test

db = SessionLocal()

print('=== BATCH COURSE IDs ===')
batches = db.query(Batch).all()
for b in batches:
    print(f'Batch {b.code}: course_id={b.course_id}, teacher_id={b.teacher_id}')

print('\n=== TEST COURSE IDs ===')
tests = db.query(Test).all()
for t in tests:
    print(f'Test "{t.title}": course_id={t.course_id}, teacher_id={t.teacher_id}')

print('\n=== MATCHING ANALYSIS ===')
for b in batches:
    matching_tests = [t for t in tests if t.course_id == b.course_id and t.teacher_id == b.teacher_id]
    print(f'Batch {b.code} (teacher_id={b.teacher_id}, course_id={b.course_id}):')
    if matching_tests:
        for t in matching_tests:
            print(f'  ✓ Can see test: {t.title}')
    else:
        print(f'  ✗ NO MATCHING TESTS')

db.close()
