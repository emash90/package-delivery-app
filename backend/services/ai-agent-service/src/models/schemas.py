from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class ChatMessage(BaseModel):
    role: MessageRole
    content: str
    timestamp: Optional[datetime] = Field(default_factory=datetime.utcnow)
    metadata: Optional[Dict[str, Any]] = {}

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = None
    auth_token: Optional[str] = None
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    success: bool
    response: str
    conversation_id: Optional[str] = None
    tools_used: List[str] = []
    metadata: Dict[str, Any] = {}
    error: Optional[str] = None

class AgentStatusResponse(BaseModel):
    status: str
    agent_name: str
    capabilities: List[str]
    example_queries: List[str]

class Conversation(BaseModel):
    id: str
    user_id: str
    messages: List[ChatMessage] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PackageInfo(BaseModel):
    id: str
    tracking_number: Optional[str] = None
    status: str
    sender_name: str
    recipient_name: str
    pickup_location: str
    delivery_location: str
    created_at: datetime
    updated_at: datetime

class ToolExecutionRequest(BaseModel):
    tool_name: str
    parameters: Dict[str, Any]
    user_id: str

class ToolExecutionResponse(BaseModel):
    success: bool
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    executed_at: datetime = Field(default_factory=datetime.utcnow)