"""
Base agent class for all AI agents
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List


class BaseAgent(ABC):
    """Abstract base class for all AI agents"""

    def __init__(self, agent_name: str, description: str):
        self.agent_name = agent_name
        self.description = description

    @abstractmethod
    async def handle_message(self, message: str, user_context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Handle a user message and return AI response"""
        pass

    @abstractmethod
    def get_capabilities(self) -> List[str]:
        """Return a list of agent capabilities"""
        pass

    @abstractmethod
    def get_example_queries(self) -> List[str]:
        """Return example queries the agent can handle"""
        pass

    def get_info(self) -> Dict[str, str]:
        """Get agent information"""
        return {
            "name": self.agent_name,
            "description": self.description
        }

    def validate_response(self, response: Dict[str, Any]) -> bool:
        """Validate agent response structure"""
        required_fields = ["success", "response"]
        return all(field in response for field in required_fields)