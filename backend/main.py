from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api_routes import router

app = FastAPI()
origins = [
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