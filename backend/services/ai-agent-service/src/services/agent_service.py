"""
Agent service for managing AI agent operations
"""

import logging
from typing import Dict, Any
from src.agents.package_assistant import PackageAssistantAgent
from src.models.schemas import AgentStatusResponse

logger = logging.getLogger(__name__)


class AgentService:
    """Service for managing AI agents"""

    def __init__(self):
        self._agent_instance: PackageAssistantAgent = None

    def get_agent(self) -> PackageAssistantAgent:
        """Get the global agent instance (singleton pattern)"""
        if self._agent_instance is None:
            self._agent_instance = PackageAssistantAgent()
        return self._agent_instance

    async def get_agent_status(self) -> AgentStatusResponse:
        """Get the current status and capabilities of the AI agent"""
        try:
            agent = self.get_agent()
            return AgentStatusResponse(
                status="active",
                agent_name=agent.agent_name,
                capabilities=agent.get_capabilities(),
                example_queries=agent.get_example_queries()
            )
        except Exception as e:
            logger.error(f"Error getting agent status: {str(e)}")
            raise e

    async def get_agent_capabilities(self) -> Dict[str, Any]:
        """Get agent capabilities and example queries"""
        try:
            agent = self.get_agent()
            return {
                "capabilities": agent.get_capabilities(),
                "example_queries": agent.get_example_queries()
            }
        except Exception as e:
            logger.error(f"Error getting agent capabilities: {str(e)}")
            raise e

    def health_check(self) -> bool:
        """Check if the agent service is healthy"""
        try:
            agent = self.get_agent()
            return agent is not None
        except Exception as e:
            logger.error(f"Agent health check failed: {str(e)}")
            return False