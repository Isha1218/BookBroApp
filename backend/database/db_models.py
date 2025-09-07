from sqlalchemy import create_engine, Column, Integer, String, Float, LargeBinary
from database.db import Base

class Highlight(Base):
    __tablename__ = "highlight"

    id = Column(Integer, primary_key=True, autoincrement=True)
    cfi_range = Column(String)
    content = Column(String)
    book_id = Column(Integer)
    user_id = Column(Integer)