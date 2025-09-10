from pydantic import BaseModel
from typing import List, Dict

class SecondPersonPOV(BaseModel):
    dialogue: str = ''

class CreateRoleplayScenes(BaseModel):
    roleplay_context: str = ''

class CreateCharacterBrief(BaseModel):
    character_name: str = ''
    scene_description: str = ''
    read_text: str = ''
    recent_chapter_context: str = ''

class Roleplay(BaseModel):
    character_name: str = ''
    user_character_name: str = ''
    character_brief: str = ''
    scene_description: str = ''
    recent_chapter_context: str = ''
    character_quotes: List[str] = []
    messages: List[Dict] = []