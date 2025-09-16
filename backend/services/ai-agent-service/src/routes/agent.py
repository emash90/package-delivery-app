"""
Agent status and information routes
"""

from fastapi import APIRouter, HTTPException, status
from src.models.schemas import AgentStatusResponse
from src.services.agent_service import AgentService

router = APIRouter(prefix="/agent", tags=["agent"])

# Service instance
agent_service = AgentService()


@router.get("/status", response_model=AgentStatusResponse)
async def get_agent_status():
    """Get the current status and capabilities of the AI agent"""
    try:
        return await agent_service.get_agent_status()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"AI Agent not available: {str(e)}"
        )


@router.get("/capabilities")
async def get_agent_capabilities():
    """Get agent capabilities"""
    try:
        return await agent_service.get_agent_capabilities()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"AI Agent not available: {str(e)}"
        )