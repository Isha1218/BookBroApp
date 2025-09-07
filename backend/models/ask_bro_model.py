from pydantic import BaseModel

class AskBro(BaseModel):
    question: str = ''
    recent_pages: str = ''
    ask_bro_context: str = ''