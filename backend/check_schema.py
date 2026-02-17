from app.database import engine
import sqlalchemy

inspector = sqlalchemy.inspect(engine)
columns = inspector.get_columns('tests')
print('Tests table schema:')
for col in columns:
    nullable_str = "(nullable)" if col["nullable"] else "(not null)"
    print(f'  {col["name"]}: {col["type"]} {nullable_str}')
