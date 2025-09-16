"""
Main application file for the AI Agent Service using proper structure.
"""
import os
import logging
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Import routes
from src.routes import health_router, chat_router, agent_router, tools_router

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(
    title="AI Agent Service",
    description="Package management AI assistant using Google Generative AI",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize the AI Agent Service on startup"""
    try:
        # Test agent initialization
        from src.agents.package_assistant import PackageAssistantAgent
        test_agent = PackageAssistantAgent()

        logger.info("AI Agent Service started successfully with Google Generative AI")
        logger.info(f"Agent capabilities: {test_agent.get_capabilities()}")

    except Exception as e:
        logger.error(f"Failed to initialize AI Agent Service: {str(e)}")
        raise e


@app.get("/")
async def root():
    """Root endpoint with service information"""
    return {
        "service": "AI Agent Service",
        "status": "running",
        "framework": "Google Generative AI",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


# Include routers
app.include_router(health_router)
app.include_router(chat_router)
app.include_router(agent_router)
app.include_router(tools_router)


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("AI Agent Service shutting down...")


if __name__ == "__main__":
    # Configuration
    host = os.getenv("AI_SERVICE_HOST", "0.0.0.0")
    port = int(os.getenv("AI_SERVICE_PORT", "3004"))
    debug = os.getenv("DEBUG", "false").lower() == "true"

    logger.info(f"Starting AI Agent Service on {host}:{port}")
    logger.info(f"Debug mode: {debug}")

    # Run the application
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    )