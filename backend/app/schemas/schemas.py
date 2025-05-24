from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ItemBase(BaseModel):
    name: str
    description: Optional[str] = None

class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    id: int

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    hashed_password: str

    class Config:
        orm_mode = True

class DocumentBase(BaseModel):
    filename: str
    s3_url: str
    extracted_text: Optional[str] = None
    uploaded_at: Optional[datetime] = None

class DocumentCreate(DocumentBase):
    pass

class Document(DocumentBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True

class ChatMessageBase(BaseModel):
    sender: str
    content: str
    timestamp: Optional[datetime] = None

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessage(ChatMessageBase):
    id: int
    session_id: int

    class Config:
        orm_mode = True

class ChatSessionBase(BaseModel):
    started_at: Optional[datetime] = None

class ChatSessionCreate(ChatSessionBase):
    pass

class ChatSession(ChatSessionBase):
    id: int
    user_id: int
    messages: List[ChatMessage] = []

    class Config:
        orm_mode = True

class Message(BaseModel):
    message: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None