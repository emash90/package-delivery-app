import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, RotateCcw, User, Package } from 'lucide-react';

const ChatHelp: React.FC = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          AI Chat Assistant
        </CardTitle>
        <CardDescription>
          Get instant help with your package tracking and delivery questions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Features:</h4>
          <div className="grid gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span>Track packages by ID or tracking number</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>User-specific chat history</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
              <span>Clear chat and start fresh anytime</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Example Questions:</h4>
          <div className="space-y-1">
            <Badge variant="outline" className="text-xs">
              "Track package TR123456789"
            </Badge>
            <Badge variant="outline" className="text-xs">
              "Show me my packages"
            </Badge>
            <Badge variant="outline" className="text-xs">
              "What's the status of package PKG175800611738388?"
            </Badge>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Click the chat button in the bottom-right corner to get started!
        </p>
      </CardContent>
    </Card>
  );
};

export default ChatHelp;