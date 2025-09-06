from fastapi import APIRouter, HTTPException
from models.recap_model import Recap
from models.lookup_model import LookUp
from models.ask_bro_model import AskBro
from models.roleplay_model import CreateRoleplayScenes, CreateCharacterBrief, Roleplay
from services.llm_service import LLMService

router = APIRouter(prefix="/api")

llm_service = LLMService()

@router.post('/get_recap')
def get_recap(recap: Recap):
    try:
        resp = llm_service.recap(recap.recap_context)
        return {"status": "success", "result": resp}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post('/do_lookup')
def do_lookup(lookup: LookUp):
    try:
        lookup_text, lookup_type = llm_service.lookup(lookup.selected_text, lookup.lookup_context)
        return {"status": "success", "lookup_text": lookup_text, "lookup_type": lookup_type}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post('/do_ask_bro')
def do_ask_bro(ask_bro: AskBro):
    try:
        resp = llm_service.ask_bro(ask_bro.question, ask_bro.ask_bro_context)
        return {"status": "success", "ask_bro_text": resp}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post('/create_roleplay_scenes')
def create_roleplay_scenes(roleplay: CreateRoleplayScenes):
    try:
        resp = llm_service.create_roleplay_scenes(roleplay.roleplay_context)
        return {"status": "success", "roleplay_scenes": resp}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post('/create_character_brief')
def create_character_brief(character_brief: CreateCharacterBrief):
    try:
        resp = llm_service.create_character_brief(character_brief.character_name, character_brief.scene_description, character_brief.read_text, character_brief.recent_chapter_context)
        return {"status": "success", "character_brief": resp}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post('/do_roleplay')
def do_roleplay(roleplay: Roleplay):
    try:
        resp = llm_service.do_roleplay(roleplay.character_name, roleplay.character_brief, roleplay.scene_description, roleplay.recent_chapter_context, roleplay.character_quotes, roleplay.messages)
        return {"status": "success", "roleplay_message": resp}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))