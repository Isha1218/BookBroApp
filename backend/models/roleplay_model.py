from pydantic import BaseModel
from typing import List, Dict

class SecondPersonPOV(BaseModel):
    dialogue: str = ''

class CreateRoleplayScenes(BaseModel):
    roleplay_context: str = ''

class CreateCharacterBrief(BaseModel):
    character_name: str = ''
    user_character_name: str = ''
    scene_description: str = ''
    read_text: str = ''
    recent_chapter_context: str = ''

class Roleplay(BaseModel):
    character_name: str = ''
    user_character_name: str = ''
    relationship_dynamic: str = ''
    current_state: str = ''
    character_brief: str = ''
    behavioral_notes: str = ''
    scene_description: str = ''
    voice_samples: List[str] = []
    recent_chapter_context: str = ''
    messages: List[Dict] = []