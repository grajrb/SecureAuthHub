from fastapi import FastAPI
from app.api.routes import router as api_router
from app.database import engine, Base

app = FastAPI(
    title="SecureAuthHub API",
    description="API documentation for SecureAuthHub backend, including document upload, parsing, NLP, search, and authentication.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Create tables
Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Welcome to my FastAPI application!"}

app.include_router(api_router)