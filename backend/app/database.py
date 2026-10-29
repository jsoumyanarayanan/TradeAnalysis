from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
from app.config import settings

engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Instrument(Base):
    __tablename__ = "instruments"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(50), unique=True, index=True, nullable=False)
    company_name = Column(String(200))
    exchange = Column(String(20), nullable=False, index=True)
    instrument_type = Column(String(20), nullable=False)
    sector = Column(String(50))
    active_status = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class MarketQuote(Base):
    __tablename__ = "market_quotes"
    
    id = Column(Integer, primary_key=True, index=True)
    instrument_id = Column(Integer, ForeignKey("instruments.id"), nullable=False, index=True)
    last_price = Column(Float, nullable=False)
    reference_price = Column(Float)
    absolute_change = Column(Float)
    percentage_change = Column(Float)
    provider_timestamp = Column(DateTime, nullable=False)
    received_timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    data_status = Column(String(20), default="LIVE")
    session_high = Column(Float)
    session_low = Column(Float)
    session_open = Column(Float)
    volume = Column(Float)
    contract_expiry = Column(String(20))
    active_session = Column(String(20))


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
