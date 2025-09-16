"""
Base tool class for all AI tools
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional


class BaseTool(ABC):
    """Abstract base class for all AI tools"""

    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description

    @abstractmethod
    async def execute(self, *args, **kwargs) -> Dict[str, Any]:
        """Execute the tool with given parameters"""
        pass

    def get_info(self) -> Dict[str, str]:
        """Get tool information"""
        return {
            "name": self.name,
            "description": self.description
        }

    def validate_result(self, result: Dict[str, Any]) -> bool:
        """Validate tool execution result"""
        return isinstance(result, dict) and "success" in result