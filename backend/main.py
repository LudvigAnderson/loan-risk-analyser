from fastapi import FastAPI
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

app.include_router(router)