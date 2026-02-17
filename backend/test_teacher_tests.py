from app.database import SessionLocal
from app.models.teacher import Teacher
from app.models.test import Test

db = SessionLocal()

print('Testing get_teacher_tests logic:')
print('\nFor user_id=6:')
teacher = db.query(Teacher).filter(Teacher.user_id == 6).first()
print(f'  Found teacher: ID={teacher.id if teacher else None}')
if teacher:
    tests = db.query(Test).filter(Test.teacher_id == teacher.id).all()
    print(f'  Tests found: {len(tests)}')
    for t in tests:
        print(f'    - {t.title}')

print('\nFor user_id=8:')
teacher = db.query(Teacher).filter(Teacher.user_id == 8).first()
print(f'  Found teacher: ID={teacher.id if teacher else None}')
if teacher:
    tests = db.query(Test).filter(Test.teacher_id == teacher.id).all()
    print(f'  Tests found: {len(tests)}')
    for t in tests:
        print(f'    - {t.title}')

db.close()
