from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api_routes import router
from database.db import engine, Base
from database.db_models import Highlight

# run with:
# python -m uvicorn main:app --host 0.0.0.0 --port 5000 --reload

app = FastAPI()
origins = [
    "http://10.21.68.6:3000"
    "http://192.168.0.19:3000",  # your dev server
    "capacitor://localhost",      # Capacitor apps
    "*",                          # allow all for testing (not recommended in prod)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

Base.metadata.create_all(engine)