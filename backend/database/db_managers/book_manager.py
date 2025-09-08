from database.db_models import Book
from file_storage.ebook_file_storage import EbookFileStorage
import base64

class BookManager:
    def __init__(self, db):
        self.db = db
        self.storage = EbookFileStorage()
    
    def add_book(self, title, author, user_id, file_bytes, cover_bytes):
        s3_link = self.storage.upload_file(file_bytes, title, author, user_id)
        new_b = Book(user_id=user_id, title=title, author=author, link=s3_link, cover_image=cover_bytes, curr_cfi="", status="start")
        self.db.add(new_b)
        self.db.commit()
        self.db.refresh(new_b)
        return new_b.id
    
    def get_status(self, book_id):
        book = self.db.query(Book).filter_by(id=book_id).first()
        return book.status 
    
    def update_status(self, book_id, status):
        book = self.db.query(Book).filter_by(id=book_id).first()
        book.status = status
        self.db.commit()
        self.db.refresh(book)
        return status
    
    def update_curr_cfi(self, book_id, curr_cfi):
        print('this is curr cfi in backend', curr_cfi)
        book = self.db.query(Book).filter_by(id=book_id).first()
        book.curr_cfi = curr_cfi
        self.db.commit()
        self.db.refresh(book)
        return curr_cfi
    
    def get_books(self, user_id):
        books = self.db.query(Book).filter_by(user_id=user_id).all()
        result = []
        for b in books:
            cover_base64 = base64.b64encode(b.cover_image).decode() if b.cover_image else None
            result.append({
                "id": b.id,
                "user_id": b.user_id,
                "title": b.title,
                "author": b.author,
                "link": b.link,
                "cover_image": cover_base64,
                "curr_cfi": b.curr_cfi,
                "status": b.status,
                "created_at": b.created_at,
                "updated_at": b.updated_at
            })
        return result