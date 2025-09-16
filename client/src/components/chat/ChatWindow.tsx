import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MessageCircle, X, Bot, AlertCircle, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAppSelector } from '@/hooks/useRedux';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { aiService, ChatMessage as ChatMessageType } from '@/services/aiService';

interface ChatWindowProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId] = useState<string>(uuidv4());
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Get current user info for chat persistence
  const { user } = useAppSelector((state) => state.auth);

  // Get chat storage key based on user
  const getChatStorageKey = () => {
    return user?.id ? `chat_history_${user.id}` : 'chat_history_guest';
  };

  // Load chat history from localStorage
  const loadChatHistory = () => {
    try {
      const storageKey = getChatStorageKey();
      const storedMessages = localStorage.getItem(storageKey);
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        // Convert timestamp strings back to Date objects
        return parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
    return [];
  };

  // Save chat history to localStorage
  const saveChatHistory = (newMessages: ChatMessageType[]) => {
    try {
      const storageKey = getChatStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  // Clear chat history
  const clearChatHistory = () => {
    try {
      const storageKey = getChatStorageKey();
      localStorage.removeItem(storageKey);

      // Reset with welcome message
      const welcomeMessage: ChatMessageType = {
        id: uuidv4(),
        message: user?.email
          ? `Hello ${user.email}! I'm your package assistant. I can help you track packages, check delivery status, and answer questions about your shipments. What would you like to know?`
          : "Hello! I'm your package assistant. I can help you track packages, check delivery status, and answer questions about your shipments. What would you like to know?",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages([welcomeMessage]);
      saveChatHistory([welcomeMessage]);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current && isOpen) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isOpen]);

  // Load chat history when component mounts or user changes
  useEffect(() => {
    const existingMessages = loadChatHistory();

    if (existingMessages.length > 0) {
      setMessages(existingMessages);
    } else {
      // Initialize with welcome message
      const welcomeMessage: ChatMessageType = {
        id: uuidv4(),
        message: user?.email
          ? `Hello ${user.email}! I'm your package assistant. I can help you track packages, check delivery status, and answer questions about your shipments. What would you like to know?`
          : "Hello! I'm your package assistant. I can help you track packages, check delivery status, and answer questions about your shipments. What would you like to know?",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages([welcomeMessage]);
      saveChatHistory([welcomeMessage]);
    }
  }, [user?.id]); // Re-run when user changes

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: ChatMessageType = {
      id: uuidv4(),
      message: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    const newMessagesAfterUser = [...messages, userMessage];
    setMessages(newMessagesAfterUser);
    setIsLoading(true);
    setError(null);

    try {
      const response = await aiService.sendMessage({
        message: messageText,
        conversation_id: conversationId,
        user_id: user?.id,
      });

      // Add AI response
      const aiMessage: ChatMessageType = {
        id: uuidv4(),
        message: response.response,
        isUser: false,
        timestamp: new Date(),
      };

      const finalMessages = [...newMessagesAfterUser, aiMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);

      if (!response.success && response.error) {
        setError(response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);

      // Add error message to chat
      const errorChatMessage: ChatMessageType = {
        id: uuidv4(),
        message: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
      };

      const finalMessages = [...newMessagesAfterUser, errorChatMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-xl z-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Package Assistant</CardTitle>
          <Badge variant="secondary" className="text-xs">
            Online
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={clearChatHistory}
            className="h-8 w-8"
            title="Clear chat history"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8"
            title="Close chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        {error && (
          <Alert className="mx-4 mb-2 flex-shrink-0" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-sm">{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="h-auto p-1 text-xs"
              >
                ×
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 min-h-0">
          <div className="py-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.message}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
          </div>
        </ScrollArea>

        <div className="flex-shrink-0">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            placeholder="Ask about package tracking, delivery status..."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatWindow;