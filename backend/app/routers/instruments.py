from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter()

@router.get("/")
async def get_instruments(db: Session = Depends(get_db)):
    return {"status": "demo", "message": "Connect to PostgreSQL for data"}
