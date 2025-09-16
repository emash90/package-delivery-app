"""
Direct tool access routes
"""

from fastapi import APIRouter, HTTPException, status
from typing import Optional
from src.services.tools_service import ToolsService

router = APIRouter(prefix="/tools", tags=["tools"])

# Service instance
tools_service = ToolsService()


@router.post("/find-package")
async def find_package_endpoint(package_id: str, auth_token: Optional[str] = None):
    """Direct endpoint for finding a package by ID"""
    try:
        result = await tools_service.find_package(package_id, auth_token)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error finding package: {str(e)}"
        )


@router.post("/track-package")
async def track_package_endpoint(tracking_number: str):
    """Direct endpoint for tracking a package by tracking number"""
    try:
        result = await tools_service.track_package(tracking_number)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error tracking package: {str(e)}"
        )


@router.post("/user-packages")
async def get_user_packages_endpoint(user_id: str, auth_token: str):
    """Direct endpoint for getting user's packages"""
    try:
        result = await tools_service.get_user_packages(user_id, auth_token)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting user packages: {str(e)}"
        )


@router.get("/available")
async def get_available_tools():
    """Get list of available tools"""
    return tools_service.get_available_tools()