from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.services.model_loader import load_ml_models
from app.core.locking import AsyncRWLock
from app.api.router import router

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.model_lock = AsyncRWLock()
    await load_ml_models(app)
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"]
)

app.include_router(router)