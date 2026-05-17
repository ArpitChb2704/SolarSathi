from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# ============================================
# SUPABASE POSTGRESQL DATABASE URL
# ============================================

# Aisolar@723
# If your password contains special characters like '@', you must URL-encode them. '@' becomes '%40'.
DATABASE_URL = "postgresql://postgres:Aisolar%40723@db.mwwbasdspgjxpmrlkldd.supabase.co:5432/postgres"

# Example:
# DATABASE_URL = "postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres"

# ============================================
# SQLALCHEMY ENGINE
# ============================================

engine = create_engine(
    DATABASE_URL
)

# ============================================
# SESSION
# ============================================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# ============================================
# BASE
# ============================================

Base = declarative_base()

# ============================================
# DATABASE DEPENDENCY
# ============================================

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()