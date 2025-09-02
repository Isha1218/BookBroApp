from fastapi import APIRouter, HTTPException
from models.recap_model import Recap
from models.lookup_model import LookUp
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