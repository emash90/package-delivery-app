"""
Package Assistant Agent using Google Generative AI.
"""
import os
import json
from typing import Dict, Any, List
import google.generativeai as genai
from .base_agent import BaseAgent
from src.tools.package_lookup import PackageLookupTool


class PackageAssistantAgent(BaseAgent):
    """
    An AI agent specialized in helping users with package-related queries.
    Uses Google Generative AI with custom tools for package management.
    """

    def __init__(self):
        """Initialize the Package Assistant Agent"""
        super().__init__(
            agent_name="Package Assistant",
            description="""
            I'm your Package Assistant! I can help you with:
            - Finding packages by ID
            - Tracking packages by tracking number
            - Viewing your packages
            - Providing package status updates
            - Answering questions about package delivery

            Just ask me anything about your packages and I'll help you find the information you need!
            """
        )

        # Initialize Google Generative AI
        api_key = os.getenv("GOOGLE_AI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel(
                model_name=os.getenv("GOOGLE_AI_MODEL", "gemini-1.5-flash")
            )
        else:
            raise ValueError("GOOGLE_AI_API_KEY environment variable is required")

        # Initialize package lookup tool
        self.package_tool = PackageLookupTool()

        # System prompt for the AI
        self.system_prompt = """You are a Package Assistant AI. You help users with package-related queries.

Available tools:
1. find_package_by_id(package_id, auth_token=None) - Find a package by its unique ID
2. track_package_by_tracking_number(tracking_number) - Track a package by tracking number (public)
3. get_user_packages(user_id, auth_token) - Get all packages for a user (requires auth)

When a user asks about packages:
- If they provide a package ID (format like PKG175800611738388 or 24-character hex string), use find_package_by_id
- If they provide a tracking number (like TR123456789), use track_package_by_tracking_number
- If they want to see all their packages, use get_user_packages
- If they don't have packages, suggest creating one
- Always be helpful and provide clear information about package status, location, and delivery details

Package ID formats accepted:
- PKG followed by numbers (e.g., PKG175800611738388)
- 24-character hexadecimal strings (e.g., 507f1f77bcf86cd799439011)

Be conversational and friendly while providing accurate package information."""

    async def handle_message(self, message: str, user_context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Handle a user message and return AI response.

        Args:
            message (str): The user's message
            user_context (Dict): Optional context about the user (user_id, auth_token, etc.)

        Returns:
            Dict containing the AI response
        """
        try:
            user_id = user_context.get("user_id") if user_context else None
            auth_token = user_context.get("auth_token") if user_context else None
            tools_used = []

            # Analyze the message to determine if we need to call tools
            full_prompt = f"{self.system_prompt}\n\nUser: {message}\n\nAssistant:"

            # Check if user is asking about specific package operations
            if self._should_use_tools(message):
                tool_result = await self._execute_tools(message, user_id, auth_token)
                tools_used = tool_result.get("tools_used", [])

                # Include tool results in the prompt
                if tool_result.get("success"):
                    full_prompt += f"\n\nTool Results: {json.dumps(tool_result['data'], indent=2)}\n\nBased on the tool results above, provide a helpful response to the user:"
                else:
                    full_prompt += f"\n\nTool Error: {tool_result.get('error', 'Unknown error')}\n\nPlease inform the user about this issue and suggest alternatives:"

            # Generate response using Gemini
            response = self.model.generate_content(full_prompt)

            return {
                "success": True,
                "response": response.text,
                "tools_used": tools_used,
                "metadata": {
                    "agent_name": self.agent_name,
                    "model_used": os.getenv("GOOGLE_AI_MODEL", "gemini-1.5-flash")
                }
            }

        except Exception as e:
            return {
                "success": False,
                "error": f"Agent error: {str(e)}",
                "response": "I'm sorry, I encountered an error while processing your request. Please try again or contact support if the issue persists."
            }

    def _should_use_tools(self, message: str) -> bool:
        """Determine if the message requires tool usage"""
        message_lower = message.lower()

        # Check for package ID patterns (PKG followed by numbers or 24-character hex strings)
        import re
        if re.search(r'pkg\d+|[0-9a-f]{24}', message_lower):
            return True

        # Check for tracking number patterns
        if re.search(r'tr\d+|track.*\d+', message_lower):
            return True

        # Check for common phrases that might require tools
        tool_triggers = [
            'find package', 'show package', 'package id',
            'track package', 'tracking number',
            'my packages', 'all packages', 'show my',
            'package status', 'where is my'
        ]

        return any(trigger in message_lower for trigger in tool_triggers)

    async def _execute_tools(self, message: str, user_id: str = None, auth_token: str = None) -> Dict[str, Any]:
        """Execute appropriate tools based on the message content"""
        message_lower = message.lower()

        # Extract package ID if present (PKG format or MongoDB ObjectId format)
        import re

        # Check for PKG format first (case insensitive)
        pkg_id_match = re.search(r'(pkg\d+)', message_lower)
        if pkg_id_match:
            package_id = pkg_id_match.group(1).upper()  # Convert to uppercase
            result = await self.package_tool.find_package_by_id(package_id, auth_token)
            return {
                "success": result["success"],
                "data": result,
                "tools_used": ["find_package_by_id"],
                "error": result.get("message") if not result["success"] else None
            }

        # Check for MongoDB ObjectId format (24-character hex)
        package_id_match = re.search(r'([0-9a-f]{24})', message_lower)
        if package_id_match:
            package_id = package_id_match.group(1)
            result = await self.package_tool.find_package_by_id(package_id, auth_token)
            return {
                "success": result["success"],
                "data": result,
                "tools_used": ["find_package_by_id"],
                "error": result.get("message") if not result["success"] else None
            }

        # Extract tracking number if present
        tracking_match = re.search(r'(tr\d+)', message_lower)
        if tracking_match:
            tracking_number = tracking_match.group(1).upper()
            result = await self.package_tool.track_package_by_tracking_number(tracking_number)
            return {
                "success": result["success"],
                "data": result,
                "tools_used": ["track_package_by_tracking_number"],
                "error": result.get("message") if not result["success"] else None
            }

        # Check for user package requests
        user_package_triggers = ['my packages', 'all packages', 'show my']
        if any(trigger in message_lower for trigger in user_package_triggers) and user_id and auth_token:
            result = await self.package_tool.get_user_packages(user_id, auth_token)
            return {
                "success": result["success"],
                "data": result,
                "tools_used": ["get_user_packages"],
                "error": result.get("message") if not result["success"] else None
            }

        return {"success": False, "error": "No appropriate tool found for this query"}

    def get_capabilities(self) -> List[str]:
        """Return a list of agent capabilities"""
        return [
            "Find packages by ID",
            "Track packages by tracking number",
            "View user's packages",
            "Provide package status information",
            "Answer package-related questions",
            "Guide users on package creation and management"
        ]

    def get_example_queries(self) -> List[str]:
        """Return example queries the agent can handle"""
        return [
            "Find package PKG175800611738388",
            "What's the status of package PKG175800611738388?",
            "Track package TR123456789",
            "Show me all my packages",
            "What's the status of my package?",
            "How do I create a new package?",
            "Where is my package being delivered?"
        ]