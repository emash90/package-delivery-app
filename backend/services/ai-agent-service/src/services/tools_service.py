"""
Tools service for direct tool access operations
"""

import logging
from typing import Dict, Any, Optional, List
from src.tools.package_lookup import PackageLookupTool

logger = logging.getLogger(__name__)


class ToolsService:
    """Service for managing and executing tools"""

    def __init__(self):
        self.package_tool = PackageLookupTool()

    async def find_package(self, package_id: str, auth_token: Optional[str] = None) -> Dict[str, Any]:
        """Find a package by ID using the package lookup tool"""
        try:
            result = await self.package_tool.find_package_by_id(package_id, auth_token)
            logger.info(f"Package lookup for {package_id}: {'success' if result['success'] else 'failed'}")
            return result
        except Exception as e:
            logger.error(f"Error finding package {package_id}: {str(e)}")
            return {
                "success": False,
                "message": f"Error finding package: {str(e)}",
                "suggestion": "Please try again later or contact support."
            }

    async def track_package(self, tracking_number: str) -> Dict[str, Any]:
        """Track a package by tracking number"""
        try:
            result = await self.package_tool.track_package_by_tracking_number(tracking_number)
            logger.info(f"Package tracking for {tracking_number}: {'success' if result['success'] else 'failed'}")
            return result
        except Exception as e:
            logger.error(f"Error tracking package {tracking_number}: {str(e)}")
            return {
                "success": False,
                "message": f"Error tracking package: {str(e)}",
                "suggestion": "Please try again later or contact support."
            }

    async def get_user_packages(self, user_id: str, auth_token: str) -> Dict[str, Any]:
        """Get all packages for a user"""
        try:
            result = await self.package_tool.get_user_packages(user_id, auth_token)
            logger.info(f"User packages lookup for {user_id}: {'success' if result['success'] else 'failed'}")
            return result
        except Exception as e:
            logger.error(f"Error getting packages for user {user_id}: {str(e)}")
            return {
                "success": False,
                "message": f"Error getting user packages: {str(e)}",
                "suggestion": "Please try again later or contact support."
            }

    def get_available_tools(self) -> Dict[str, List[Dict[str, Any]]]:
        """Get list of available tools and their information"""
        return {
            "tools": [
                {
                    "name": "find_package_by_id",
                    "description": "Find a package by its unique ID",
                    "parameters": ["package_id", "auth_token (optional)"],
                    "endpoint": "/tools/find-package"
                },
                {
                    "name": "track_package_by_tracking_number",
                    "description": "Track a package by tracking number",
                    "parameters": ["tracking_number"],
                    "endpoint": "/tools/track-package"
                },
                {
                    "name": "get_user_packages",
                    "description": "Get all packages for a user",
                    "parameters": ["user_id", "auth_token"],
                    "endpoint": "/tools/user-packages"
                }
            ]
        }

    def health_check(self) -> bool:
        """Check if tools service is healthy"""
        try:
            # Test if we can initialize the package tool
            return self.package_tool is not None
        except Exception as e:
            logger.error(f"Tools service health check failed: {str(e)}")
            return False