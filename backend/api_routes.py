from fastapi import APIRouter, HTTPException
from models.recap_model import Recap
from models.lookup_model import LookUp
from models.ask_bro_model import AskBro
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