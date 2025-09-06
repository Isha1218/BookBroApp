from pydantic import BaseModel

class Roleplay(BaseModel):
    roleplay_context: str = ''