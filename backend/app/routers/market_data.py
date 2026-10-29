from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.market_data import QuoteResponse, MarketOverview

router = APIRouter()

@router.get("/overview", response_model=MarketOverview)
async def get_market_overview(db: Session = Depends(get_db)):
    return {"status": "demo", "message": "Connect to PostgreSQL for data"}

@router.get("/quotes/{symbol}", response_model=QuoteResponse)
async def get_quote(symbol: str, db: Session = Depends(get_db)):
    return {"symbol": symbol, "status": "demo"}
