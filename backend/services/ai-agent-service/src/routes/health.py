"""
Health check routes
"""

from fastapi import APIRouter
from typing import Dict

router = APIRouter(prefix="/health", tags=["health"])


@router.get("/")
async def health_check() -> Dict[str, str]:
    """Health check endpoint"""
    return {"status": "healthy", "service": "ai-agent-service"}


@router.get("/ready")
async def readiness_check() -> Dict[str, str]:
    """Readiness check endpoint"""
    return {"status": "ready", "service": "ai-agent-service"}


@router.get("/live")
async def liveness_check() -> Dict[str, str]:
    """Liveness check endpoint"""
    return {"status": "alive", "service": "ai-agent-service"}