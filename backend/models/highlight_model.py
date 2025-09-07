from pydantic import BaseModel

class AddHighlight(BaseModel):
    book_id: int = 0
    user_id: int = 0
    cfi_range: str = ''
    content: str = ''

class AllHighlights(BaseModel):
    book_id: int = 0