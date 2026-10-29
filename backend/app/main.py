from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db
from app.routers import market_data, instruments

app = FastAPI(title=settings.app_name, version=settings.app_version)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(market_data.router, prefix="/api", tags=["Market Data"])
app.include_router(instruments.router, prefix="/api/instruments", tags=["Instruments"])

@app.on_event("startup")
async def startup_event():
    init_db()

@app.get("/")
async def root():
    return {"app": settings.app_name, "version": settings.app_version, "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
