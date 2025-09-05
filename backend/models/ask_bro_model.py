from pydantic import BaseModel

class AskBro(BaseModel):
    question: str = ''
    ask_bro_context: str = ''