"""
Chat conversation routes
"""

from fastapi import APIRouter
from src.models.schemas import ChatRequest, ChatResponse
from src.services.chat_service import ChatService

router = APIRouter(prefix="/chat", tags=["chat"])

# Service instance
chat_service = ChatService()


@router.post("/", response_model=ChatResponse)
async def chat_with_agent(request: ChatRequest):
    """
    Main chat endpoint for interacting with the AI agent.

    The agent can help with:
    - Finding packages by ID
    - Tracking packages by tracking number
    - Viewing user packages
    - Answering package-related questions
    """
    return await chat_service.process_chat_message(request)


@router.post("/reset")
async def reset_conversation(conversation_id: str = None):
    """Reset a conversation or all conversations"""
    return await chat_service.reset_conversation(conversation_id)