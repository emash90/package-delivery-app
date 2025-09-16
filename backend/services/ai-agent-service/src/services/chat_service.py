"""
Chat service for handling AI conversations
"""

import logging
from typing import Dict, Any
from src.agents.package_assistant import PackageAssistantAgent
from src.models.schemas import ChatRequest, ChatResponse

logger = logging.getLogger(__name__)


class ChatService:
    """Service for handling AI chat conversations"""

    def __init__(self):
        self._agent_instance: PackageAssistantAgent = None

    def get_agent(self) -> PackageAssistantAgent:
        """Get the global agent instance (singleton pattern)"""
        if self._agent_instance is None:
            self._agent_instance = PackageAssistantAgent()
        return self._agent_instance

    async def process_chat_message(self, request: ChatRequest) -> ChatResponse:
        """
        Process a chat message and return AI response.

        Args:
            request: ChatRequest containing the user message and context

        Returns:
            ChatResponse with AI response and metadata
        """
        try:
            agent = self.get_agent()

            # Prepare user context
            user_context = {
                "user_id": request.user_id,
                "auth_token": request.auth_token,
                "conversation_id": request.conversation_id
            }

            # Get response from the agent
            result = await agent.handle_message(
                message=request.message,
                user_context=user_context
            )

            if result["success"]:
                return ChatResponse(
                    success=True,
                    response=result["response"],
                    conversation_id=request.conversation_id,
                    tools_used=result.get("tools_used", []),
                    metadata=result.get("metadata", {})
                )
            else:
                return ChatResponse(
                    success=False,
                    response=result["response"],
                    error=result.get("error")
                )

        except Exception as e:
            logger.error(f"Error processing chat message: {str(e)}")
            return ChatResponse(
                success=False,
                response="I'm sorry, I encountered an error while processing your request. Please try again.",
                error=str(e)
            )

    async def reset_conversation(self, conversation_id: str = None) -> Dict[str, str]:
        """Reset a conversation or all conversations"""
        try:
            # In a real implementation, this would clear conversation history from storage
            return {
                "message": f"Conversation {'with ID ' + conversation_id if conversation_id else 'history'} reset successfully",
                "conversation_id": conversation_id
            }
        except Exception as e:
            logger.error(f"Error resetting conversation: {str(e)}")
            raise e