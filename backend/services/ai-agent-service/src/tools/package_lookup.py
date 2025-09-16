"""
Package lookup tools for the AI agent service
"""
import asyncio
import httpx
import os
from typing import Dict, Any, Optional
from .base_tool import BaseTool

# Configuration
PACKAGE_SERVICE_URL = os.getenv("PACKAGE_SERVICE_URL", "http://localhost:3002")
GATEWAY_URL = os.getenv("GATEWAY_URL", "http://localhost:3000")


class PackageLookupTool(BaseTool):
    """Tool for looking up package information"""

    def __init__(self):
        super().__init__(
            name="package_lookup",
            description="Tool for finding and tracking packages"
        )

    async def execute(self, method: str, *args, **kwargs) -> Dict[str, Any]:
        """Execute package lookup operations"""
        if method == "find_by_id":
            return await self.find_package_by_id(*args, **kwargs)
        elif method == "track_by_number":
            return await self.track_package_by_tracking_number(*args, **kwargs)
        elif method == "get_user_packages":
            return await self.get_user_packages(*args, **kwargs)
        else:
            return {
                "success": False,
                "message": f"Unknown method: {method}",
                "suggestion": "Available methods: find_by_id, track_by_number, get_user_packages"
            }

    async def find_package_by_id(self, package_id: str, auth_token: Optional[str] = None) -> Dict[str, Any]:
        """
        Find a package by its ID using the tracking API (public) or packages API (authenticated).

        Args:
            package_id (str): The unique identifier of the package
            auth_token (str, optional): Authentication token if required

        Returns:
            Dict containing package information or error message
        """
        try:
            headers = {"Content-Type": "application/json"}
            if auth_token:
                headers["Authorization"] = f"Bearer {auth_token}"

            async with httpx.AsyncClient(timeout=30.0) as client:
                # First try the public tracking endpoint (works for both tracking numbers and package IDs)
                try:
                    response = await client.get(f"{GATEWAY_URL}/api/track/{package_id}")

                    if response.status_code == 200:
                        package_data = response.json()
                        return {
                            "success": True,
                            "data": {
                                "id": package_data.get("_id") or package_data.get("id", package_id),
                                "tracking_number": package_data.get("trackingId") or package_data.get("trackingNumber"),
                                "status": package_data.get("status", "Unknown"),
                                "name": package_data.get("name"),
                                "description": package_data.get("description"),
                                "weight": package_data.get("weight"),
                                "recipient_name": package_data.get("recipientName"),
                                "recipient_contact": package_data.get("recipientContact"),
                                "location": package_data.get("location"),
                                "eta": package_data.get("eta"),
                                "category": package_data.get("category"),
                                "created_at": package_data.get("createdAt"),
                                "updated_at": package_data.get("updatedAt"),
                                "last_update": package_data.get("lastUpdate")
                            },
                            "message": f"Found package {package_id} successfully!"
                        }
                except:
                    pass  # Fall through to authenticated endpoint

                # If tracking endpoint fails and we have auth, try the authenticated packages endpoint
                if auth_token:
                    response = await client.get(
                        f"{GATEWAY_URL}/api/packages/{package_id}",
                        headers=headers
                    )

                    if response.status_code == 200:
                        package_data = response.json()
                        return {
                            "success": True,
                            "data": {
                                "id": package_data.get("_id") or package_data.get("id", package_id),
                                "tracking_number": package_data.get("trackingId") or package_data.get("trackingNumber"),
                                "status": package_data.get("status", "Unknown"),
                                "name": package_data.get("name"),
                                "description": package_data.get("description"),
                                "weight": package_data.get("weight"),
                                "recipient_name": package_data.get("recipientName"),
                                "recipient_contact": package_data.get("recipientContact"),
                                "location": package_data.get("location"),
                                "eta": package_data.get("eta"),
                                "category": package_data.get("category"),
                                "created_at": package_data.get("createdAt"),
                                "updated_at": package_data.get("updatedAt"),
                                "last_update": package_data.get("lastUpdate")
                            },
                            "message": f"Found package {package_id} successfully!"
                        }
                    elif response.status_code == 404:
                        return {
                            "success": False,
                            "message": f"Package with ID '{package_id}' was not found. Please check the package ID and try again.",
                            "suggestion": "Make sure you have the correct package ID format (PKG followed by numbers)."
                        }
                    elif response.status_code == 401:
                        return {
                            "success": False,
                            "message": "Authentication required. Please log in to view this package.",
                            "suggestion": "This package might be private and requires authentication."
                        }
                    else:
                        return {
                            "success": False,
                            "message": f"Unable to fetch package information. Service returned status: {response.status_code}",
                            "suggestion": "Please try again later or contact support if the issue persists."
                        }
                else:
                    # No auth token and tracking endpoint failed
                    return {
                        "success": False,
                        "message": f"Package with ID '{package_id}' was not found or requires authentication.",
                        "suggestion": "Please log in to view private package details, or verify the package ID is correct."
                    }

        except httpx.TimeoutException:
            return {
                "success": False,
                "message": "Request timed out while searching for the package.",
                "suggestion": "The service might be busy. Please try again in a moment."
            }
        except httpx.ConnectError:
            return {
                "success": False,
                "message": "Unable to connect to the package service.",
                "suggestion": "The service might be temporarily unavailable. Please try again later."
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"An unexpected error occurred: {str(e)}",
                "suggestion": "Please try again or contact support if the problem continues."
            }

    async def track_package_by_tracking_number(self, tracking_number: str) -> Dict[str, Any]:
        """
        Track a package using its tracking number (public endpoint).

        Args:
            tracking_number (str): The tracking number of the package

        Returns:
            Dict containing tracking information or error message
        """
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                # Use the public tracking endpoint
                response = await client.get(f"{GATEWAY_URL}/api/track/{tracking_number}")

                if response.status_code == 200:
                    tracking_data = response.json()
                    return {
                        "success": True,
                        "data": tracking_data,
                        "message": f"Successfully tracked package with tracking number: {tracking_number}"
                    }
                elif response.status_code == 404:
                    return {
                        "success": False,
                        "message": f"No package found with tracking number '{tracking_number}'.",
                        "suggestion": "Please verify the tracking number and try again. Tracking numbers are usually provided when you create a package."
                    }
                else:
                    return {
                        "success": False,
                        "message": f"Unable to track package. Service returned status: {response.status_code}",
                        "suggestion": "Please try again later."
                    }

        except Exception as e:
            return {
                "success": False,
                "message": f"Error tracking package: {str(e)}",
                "suggestion": "Please try again or contact support."
            }

    async def get_user_packages(self, user_id: str, auth_token: str) -> Dict[str, Any]:
        """
        Get all packages belonging to a user.

        Args:
            user_id (str): The user's ID
            auth_token (str): Authentication token

        Returns:
            Dict containing user's packages or error message
        """
        try:
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {auth_token}"
            }

            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{GATEWAY_URL}/api/packages/user/{user_id}",
                    headers=headers
                )

                if response.status_code == 200:
                    packages = response.json()
                    if not packages:
                        return {
                            "success": True,
                            "data": [],
                            "message": "You don't have any packages yet.",
                            "suggestion": "Would you like to create your first package? You can start by clicking 'Create Package' in the dashboard."
                        }

                    return {
                        "success": True,
                        "data": packages,
                        "count": len(packages),
                        "message": f"Found {len(packages)} package(s) for this user."
                    }
                elif response.status_code == 401:
                    return {
                        "success": False,
                        "message": "Authentication failed. Please log in again.",
                        "suggestion": "Your session may have expired. Please refresh and log in again."
                    }
                else:
                    return {
                        "success": False,
                        "message": f"Unable to fetch packages. Service returned status: {response.status_code}",
                        "suggestion": "Please try again later."
                    }

        except Exception as e:
            return {
                "success": False,
                "message": f"Error fetching user packages: {str(e)}",
                "suggestion": "Please try again or contact support."
            }


# Tool functions that will be registered with Google Generative AI
def find_package_by_id_sync(package_id: str, auth_token: Optional[str] = None) -> Dict[str, Any]:
    """Synchronous wrapper for find_package_by_id"""
    tool = PackageLookupTool()
    return asyncio.run(tool.find_package_by_id(package_id, auth_token))


def track_package_by_tracking_number_sync(tracking_number: str) -> Dict[str, Any]:
    """Synchronous wrapper for track_package_by_tracking_number"""
    tool = PackageLookupTool()
    return asyncio.run(tool.track_package_by_tracking_number(tracking_number))


def get_user_packages_sync(user_id: str, auth_token: str) -> Dict[str, Any]:
    """Synchronous wrapper for get_user_packages"""
    tool = PackageLookupTool()
    return asyncio.run(tool.get_user_packages(user_id, auth_token))