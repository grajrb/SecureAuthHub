import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Bot, Send, Settings, Paperclip } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Array<{
    documentId: number;
    documentName: string;
    relevantText: string;
  }>;
  timestamp: Date;
}

export default function RAGPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your AI assistant. I can help you find information from your uploaded documents. Try asking me something like \"What were the key findings in the Q3 report?\"",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth() as { user: { firstName?: string; lastName?: string; username?: string } };
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Listen for sidebar query click events
    const handler = (e: any) => {
      if (e.detail && typeof e.detail.query === 'string') {
        setInputValue(e.detail.query);
        // Auto-submit the query after a short delay
        setTimeout(() => {
          if (!isLoading) {
            // Simulate form submit using the same logic as handleSubmit
            const userMessage = {
              id: Date.now().toString(),
              role: "user" as const,
              content: e.detail.query,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, userMessage]);
            setInputValue("");
            setIsLoading(true);
            apiRequest("POST", "/api/chat/query", {
              message: e.detail.query,
              sessionId: currentSessionId
            })
              .then(async response => {
                const data = await response.json();
                if (!currentSessionId) {
                  setCurrentSessionId(data.sessionId);
                }
                const assistantMessage = {
                  id: (Date.now() + 1).toString(),
                  role: "assistant" as const,
                  content: data.answer,
                  sources: data.sources,
                  timestamp: new Date()
                };
                setMessages(prev => [...prev, assistantMessage]);
              })
              .catch((error: any) => {
                toast({
                  title: "Error",
                  description: error.message || "Failed to process your query. Please try again.",
                  variant: "destructive",
                });
              })
              .finally(() => {
                setIsLoading(false);
              });
          }
        }, 100);
      }
    };
    window.addEventListener('open-ai-assistant', handler);
    return () => window.removeEventListener('open-ai-assistant', handler);
  }, [currentSessionId, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/chat/query", {
        message: inputValue,
        sessionId: currentSessionId
      });

      const data = await response.json();
      
      if (!currentSessionId) {
        setCurrentSessionId(data.sessionId);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        sources: data.sources,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process your query. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
  };

  const getInitials = (firstName?: string, lastName?: string, username?: string) => {
    if (firstName || lastName) {
      return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
    }
    if (username) return username[0]?.toUpperCase() || "U";
    return "U";
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      {/* Query Panel Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-1">Ask questions about your documents</p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start space-x-3 ${
            message.role === "user" ? "justify-end" : ""
          }`}>
            {message.role === "assistant" && (
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div className={`max-w-xs ${
              message.role === "user" 
                ? "bg-primary text-white" 
                : "bg-gray-50"
            } rounded-lg p-3`}>
              <p className="text-sm">{message.content}</p>
              
              {message.sources && message.sources.length > 0 && (
                <div className="text-xs text-gray-500 border-t border-gray-200 pt-2 mt-2">
                  <div className="space-y-1">
                    {message.sources.map((source, index) => (
                      <div key={index}>
                        Source: {source.documentName}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {message.role === "user" && (
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="text-xs">
                  {getInitials(user?.firstName, user?.lastName, user?.username)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animate-delay-0"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animate-delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animate-delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Query Input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Button type="button" variant="ghost" size="sm">
            <Paperclip className="w-4 h-4" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question about your documents..."
              className="pr-12"
              disabled={isLoading}
            />
            <Button 
              type="submit"
              size="sm"
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-3">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => handleQuickAction("Summarize documents")}
            className="text-xs"
          >
            Summarize documents
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => handleQuickAction("Find key metrics")}
            className="text-xs"
          >
            Find key metrics
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => handleQuickAction("Compare data")}
            className="text-xs"
          >
            Compare data
          </Button>
        </div>
      </div>
    </div>
  );
}
