from pydantic import BaseModel

class UpdateStatus(BaseModel):
    status: str = ''

class UpdateCurrCFI(BaseModel):
    curr_cfi: str = ''