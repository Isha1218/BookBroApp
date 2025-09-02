from fastapi import APIRouter, HTTPException
from models.recap_model import Recap
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