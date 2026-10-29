from pydantic import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    app_name: str = "GIFT Nifty NSE Market Intelligence Terminal"
    app_version: str = "1.0.0"
    debug: bool = False

    # Database (Render PostgreSQL)
    database_url: str = "postgresql://user:password@localhost/dbname"

    # API Settings
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    cors_origins: list = ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"]

    # Scheduler
    enable_scheduler: bool = True
    data_refresh_interval_seconds: int = 60

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
