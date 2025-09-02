from pydantic import BaseModel

class Recap(BaseModel):
    recap_context: str = ''