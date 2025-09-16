"""
Routes package for AI Agent Service
"""

from .health import router as health_router
from .chat import router as chat_router
from .agent import router as agent_router
from .tools import router as tools_router

__all__ = ["health_router", "chat_router", "agent_router", "tools_router"]