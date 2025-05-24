from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

POSTGRES_USER = os.getenv("PG_USER")
POSTGRES_PASSWORD = os.getenv("PG_PASSWORD")
POSTGRES_DB = os.getenv("PG_DATABASE")
POSTGRES_HOST = os.getenv("PG_HOST")
POSTGRES_PORT = os.getenv("PG_PORT")

SQLALCHEMY_DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
