import { useState } from "react";
import { getChatbotResponse } from "../lib/gemini";
import { getProgress, getStats } from "../lib/localStorage";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import Button from "./Button";
import Input from "./Input";
import { ScrollArea } from "./BaseComponents";
import { Send, MessageCircle, Bot, User } from "lucide-react";
import { toast } from "sonner";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hi! I'm your AI puzzle assistant. Ask me for hints, tips, or chat about your progress! 🤖",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Get user context
      const progress = getProgress();
      const stats = getStats();
      const context = `User stats: Level ${progress.level}, IQ ${Math.round(
        progress.averageIQ,
      )}, Streak ${progress.streak} days, ${
        stats.totalPuzzlesSolved
      } puzzles solved`;

      const response = await getChatbotResponse(inputMessage, context);

      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      toast.error("Failed to get response from AI assistant");
      console.error("Chatbot error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const quickQuestions = [
    "Give me a hint for logic puzzles",
    "How can I improve my IQ score?",
    "What's my progress like?",
    "Tips for pattern recognition",
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="puzzle-gradient rounded-full w-16 h-16 shadow-lg hover:scale-110 transition-transform neon-glow"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="glass-effect border-purple-500/20 shadow-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="text-purple-400" />
              <span className="text-lg">AI Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-purple-300 hover:text-white"
            >
              ✕
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Messages */}
          <ScrollArea className="h-64 w-full pr-4">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      message.type === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        message.type === "user"
                          ? "bg-purple-500/20"
                          : "bg-blue-500/20"
                      }`}
                    >
                      {message.type === "user" ? (
                        <User className="h-4 w-4 text-purple-400" />
                      ) : (
                        <Bot className="h-4 w-4 text-blue-400" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        message.type === "user"
                          ? "bg-purple-500/20 text-purple-100"
                          : "bg-blue-500/20 text-blue-100"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-60 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-full bg-blue-500/20">
                      <Bot className="h-4 w-4 text-blue-400 animate-pulse" />
                    </div>
                    <div className="bg-blue-500/20 text-blue-100 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Questions */}
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInputMessage(question)}
                className="text-xs bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
              >
                {question}
              </Button>
            ))}
          </div>

          {/* Input */}
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="puzzle-gradient text-white"
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chatbot;
