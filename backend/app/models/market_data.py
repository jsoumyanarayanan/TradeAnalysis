from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class QuoteResponse(BaseModel):
    symbol: str
    last_price: float
    reference_price: Optional[float]
    absolute_change: Optional[float]
    percentage_change: Optional[float]
    session_high: Optional[float]
    session_low: Optional[float]
    session_open: Optional[float]
    volume: Optional[float]
    provider_timestamp: datetime
    data_status: str


class MarketOverview(BaseModel):
    gift_nifty: Optional[dict]
    nifty_50: Optional[dict]
    nifty_bank: Optional[dict]
    sector_summary: list
    market_breadth: dict
    timestamp: datetime
