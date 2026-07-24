import os
import sqlalchemy
from dotenv import load_dotenv

# Load env
load_dotenv()
db_url = os.getenv("DATABASE_URL")
if not db_url:
    print("No DATABASE_URL found in .env")
    exit(1)
    
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

# Read SQL file
sql_file_path = r"c:\Users\ANINDITA\Downloads\Med-India\Med-India\Med-India\neon_setup.sql"
print(f"Reading SQL file from {sql_file_path}...")
with open(sql_file_path, "r", encoding="utf-8") as f:
    sql_script = f.read()

print("Connecting to database...")
engine = sqlalchemy.create_engine(db_url)
raw_conn = engine.raw_connection()
try:
    cursor = raw_conn.cursor()
    print("Executing SQL script (this might take a few seconds)...")
    cursor.execute(sql_script)
    raw_conn.commit()
    cursor.close()
    print("SUCCESS: Tables and schema have been created/updated in the Neon Database!")
except Exception as e:
    raw_conn.rollback()
    print(f"ERROR executing script: {e}")
finally:
    raw_conn.close()
