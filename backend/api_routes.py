from fastapi import APIRouter, HTTPException, UploadFile, Form, Depends
from typing import Optional
from models.recap_model import Recap
from models.lookup_model import LookUp
from models.ask_bro_model import AskBro
from models.roleplay_model import CreateRoleplayScenes, CreateCharacterBrief, Roleplay, SecondPersonPOV
from models.highlight_model import AddHighlight
from models.book_model import UpdateStatus, UpdateCurrCFI
from services.llm_service import LLMService
from database.db import SessionLocal
from sqlalchemy.orm import Session
from database.db_managers.highlight_manager import HighlightManager
from database.db_managers.book_manager import BookManager

router = APIRouter(prefix="/api")

llm_service = LLMService()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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
        resp = llm_service.ask_bro(ask_bro.question, ask_bro.recent_pages, ask_bro.ask_bro_context)
        return {"status": "success", "ask_bro_text": resp}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post('/second_person_pov')
def convert_to_second_person_pov(second_person_pov: SecondPersonPOV):
    try:
        resp = llm_service.convert_to_second_person_pov(second_person_pov.dialogue)
        return {"status": "success", "dialogue": resp}
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
        resp = llm_service.create_character_brief(character_brief.character_name, character_brief.user_character_name, character_brief.scene_description, character_brief.read_text, character_brief.recent_chapter_context)
        return {"status": "success", "character_brief": resp}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post('/do_roleplay')
def do_roleplay(roleplay: Roleplay):
    try:
        resp = llm_service.do_roleplay(roleplay.character_name, roleplay.user_character_name, roleplay.relationship_dynamic, roleplay.current_state, roleplay.character_brief, roleplay.behavioral_notes, roleplay.scene_description, roleplay.voice_samples, roleplay.recent_chapter_context, roleplay.messages)
        return {"status": "success", "roleplay_message": resp}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post('/add_highlight')
def add_highlight(add_highlight: AddHighlight, db: Session = Depends(get_db)):
    manager = HighlightManager(db)
    return manager.add_highlight(add_highlight.cfi_range, add_highlight.content, add_highlight.user_id, add_highlight.book_id)

@router.get("/highlights")
def get_highlights(book_id, db: Session = Depends(get_db)):
    manager = HighlightManager(db)
    return manager.get_highlights(book_id)

@router.post('/add_book')
async def add_book(title: str = Form(...), author: str = Form(...), user_id: int = Form(...), file_bytes: UploadFile = None, cover_bytes: Optional[UploadFile] = None, db: Session = Depends(get_db)):
    file_data = await file_bytes.read()
    cover_data = await cover_bytes.read() if cover_bytes else b""
    manager = BookManager(db)
    return manager.add_book(title, author, user_id, file_data, cover_data)

@router.get('/books')
def get_books(user_id, db: Session = Depends(get_db)):
    manager = BookManager(db)
    return manager.get_books(user_id)

@router.get("/book_status")
def get_status(book_id, db: Session = Depends(get_db)):
    manager = BookManager(db)
    return manager.get_status(book_id)

@router.patch("/books/{book_id}/update_status")
def update_status(book_id, update: UpdateStatus, db: Session = Depends(get_db)):
    manager = BookManager(db)
    updated_status = manager.update_status(book_id, update.status)
    return {"status": "success", "updated_status": updated_status}

@router.patch("/books/{book_id}/update_curr_cfi")
def update_curr_cfi(book_id, update: UpdateCurrCFI, db: Session = Depends(get_db)):
    manager = BookManager(db)
    updated_curr_cfi = manager.update_curr_cfi(book_id, update.curr_cfi)
    return {"status": "success", "updated_curr_cfi": updated_curr_cfi}
