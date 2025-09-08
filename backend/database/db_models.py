from sqlalchemy import create_engine, Column, Integer, String, DateTime, LargeBinary, func
from database.db import Base

class Highlight(Base):
    __tablename__ = "highlight"

    id = Column(Integer, primary_key=True, autoincrement=True)
    cfi_range = Column(String)
    content = Column(String)
    book_id = Column(Integer)
    user_id = Column(Integer)

class Book(Base):
    __tablename__ = "book"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer)
    title = Column(String)
    author = Column(String)
    link = Column(String)
    cover_image = Column(LargeBinary)
    curr_cfi = Column(String)
    status = Column(String)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())