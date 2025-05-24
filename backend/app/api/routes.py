from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.models.models import Item, User
from app.schemas.schemas import Item as ItemSchema, ItemCreate, User as UserSchema, UserCreate, Token
from app.dependencies import get_db, authenticate_user, create_access_token, get_password_hash, get_current_user
from app.s3_utils import upload_file_to_s3
from app.unstructured_utils import parse_document
from app.rag_utils import build_index_from_docs, query_llama_index
from app.es_utils import index_document, search_documents
from datetime import timedelta
import tempfile
import os

# If Autogen/Crewai agent is available, import and initialize here
try:
    from autogen import Agent
except ImportError:
    Agent = None

router = APIRouter()

@router.get("/items/", response_model=list[ItemSchema])
def read_items(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Item).offset(skip).limit(limit).all()

@router.post("/items/", response_model=ItemSchema)
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    db_item = Item(name=item.name, description=item.description)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/items/{item_id}", response_model=ItemSchema)
def read_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item

@router.put("/items/{item_id}", response_model=ItemSchema)
def update_item(item_id: int, item: ItemCreate, db: Session = Depends(get_db)):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    db_item.name = item.name
    db_item.description = item.description
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/items/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(db_item)
    db.commit()
    return {"message": "Item deleted successfully"}

@router.post("/register", response_model=UserSchema)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = get_password_hash(user.password)
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me", response_model=UserSchema)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/documents/upload")
def upload_document(file: UploadFile = File(...)):
    # Save uploaded file to a temp location
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(file.file.read())
        tmp_path = tmp.name
    # Upload to S3
    s3_url = upload_file_to_s3(tmp_path, file.filename)
    # Parse with unstructured.io
    elements = parse_document(tmp_path)
    extracted_text = "\n".join([str(e) for e in elements])
    # Index with LangChain/LlamaIndex (scaffolded)
    # (Assume docs are stored in a directory for LlamaIndex)
    doc_dir = os.path.dirname(tmp_path)
    build_index_from_docs(doc_dir)
    # Index metadata in Elasticsearch
    doc_meta = {"filename": file.filename, "s3_url": s3_url, "extracted_text": extracted_text}
    index_document("documents", file.filename, doc_meta)
    os.remove(tmp_path)
    return {"s3_url": s3_url, "extracted_text": extracted_text}

@router.post("/chat/query")
def rag_query(query: str):
    # Use LlamaIndex to retrieve relevant context
    try:
        context = query_llama_index(query)
    except Exception as e:
        context = f"[LlamaIndex error] {str(e)}"
    # Use Autogen/Crewai agent if available
    if Agent:
        agent = Agent()
        answer = agent.run(query, context=context)
    else:
        answer = f"[Agent not installed] Context: {context} | Query: {query}"
    return {"answer": answer, "context": context}

@router.get("/search")
def search(q: str):
    # Search documents in Elasticsearch
    query_body = {"query": {"match": {"extracted_text": q}}}
    results = search_documents("documents", query_body)
    return results