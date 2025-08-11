from fastapi import Header, HTTPException, status
import os

async def verify_api_key(api_key: str = Header(...)):
    if api_key != os.getenv("API_SECRET_KEY"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key"
        )