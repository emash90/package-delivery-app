// AI Service for communicating with the AI Agent Service

const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:3004';

export interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  user_id?: string;
  auth_token?: string;
  conversation_id?: string;
}

export interface ChatResponse {
  success: boolean;
  response: string;
  conversation_id?: string;
  tools_used?: string[];
  metadata?: Record<string, unknown>;
  error?: string;
}

export interface AgentStatus {
  status: string;
  agent_name: string;
  capabilities: string[];
  example_queries: string[];
}

class AIService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const token = localStorage.getItem('token');

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers as Record<string, string>,
      };

      const response = await fetch(`${AI_SERVICE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `AI Service Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI Service request failed:', error);
      throw error;
    }
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const token = localStorage.getItem('token');

    return this.makeRequest<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({
        ...request,
        auth_token: token,
      }),
    });
  }

  async getAgentStatus(): Promise<AgentStatus> {
    return this.makeRequest<AgentStatus>('/agent/status');
  }

  async findPackage(packageId: string): Promise<unknown> {
    const token = localStorage.getItem('token');

    return this.makeRequest<unknown>('/tools/find-package', {
      method: 'POST',
      body: JSON.stringify({
        package_id: packageId,
        auth_token: token,
      }),
    });
  }

  async trackPackage(trackingNumber: string): Promise<unknown> {
    return this.makeRequest<unknown>('/tools/track-package', {
      method: 'POST',
      body: JSON.stringify({
        tracking_number: trackingNumber,
      }),
    });
  }

  async healthCheck(): Promise<{ status: string; service: string }> {
    return this.makeRequest<{ status: string; service: string }>('/health');
  }
}

export const aiService = new AIService();