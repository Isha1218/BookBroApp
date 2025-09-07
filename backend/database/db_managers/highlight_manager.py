from database.db_models  import Highlight

class HighlightManager:
    def __init__(self, db):
        self.db = db

    def add_highlight(self, cfi_range, content, user_id, book_id):
        new_h = Highlight(cfi_range=cfi_range, content=content, book_id=book_id, user_id=user_id)
        self.db.add(new_h)
        self.db.commit()
        self.db.refresh(new_h)
        return new_h.id
    
    def get_highlights(self, book_id):
        highlights = self.db.query(Highlight).filter(Highlight.book_id == book_id).all()
        result = [
            {
                "id": h.id,
                "bookId": h.book_id,
                "userId": h.user_id,
                "cfiRange": h.cfi_range,
                "content": h.content
            }
            for h in highlights
        ]
        return result
    
    def delete_highlight(self, highlight_id):
        h = self.db.query(Highlight).filter(Highlight.id == highlight_id).first()
        if h:
            self.db.delete(h)
            self.db.commit()
            return True
        return False