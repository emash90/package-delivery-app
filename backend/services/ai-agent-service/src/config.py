import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = int(os.getenv("AI_SERVICE_PORT", "3004"))
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"

    # Google AI Configuration
    google_ai_api_key: str = os.getenv("GOOGLE_AI_API_KEY", "")
    google_ai_model: str = os.getenv("GOOGLE_AI_MODEL", "gemini-pro")
    google_ai_temperature: float = float(os.getenv("GOOGLE_AI_TEMPERATURE", "0.7"))
    google_ai_max_tokens: int = int(os.getenv("GOOGLE_AI_MAX_TOKENS", "1000"))

    # Service URLs
    user_service_url: str = os.getenv("USER_SERVICE_URL", "http://localhost:3001")
    package_service_url: str = os.getenv("PACKAGE_SERVICE_URL", "http://localhost:3002")
    delivery_service_url: str = os.getenv("DELIVERY_SERVICE_URL", "http://localhost:3003")
    gateway_url: str = os.getenv("GATEWAY_URL", "http://localhost:3000")

    # Database Configuration
    mongodb_uri: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017/packaroo")

    # JWT Configuration
    jwt_secret: str = os.getenv("JWT_SECRET", "your-jwt-secret-key")
    jwt_algorithm: str = "HS256"

    class Config:
        env_file = ".env"

settings = Settings()