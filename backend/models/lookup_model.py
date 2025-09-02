from pydantic import BaseModel

class LookUp(BaseModel):
    selected_text: str = ''
    lookup_context: str = ''