import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Heart, Lightbulb, Shield, Zap } from "lucide-react";
import { Emotion } from "./EmotionDetector";
import Sentiment from "sentiment";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  emotion?: Emotion;
  sentiment?: 'positive' | 'negative' | 'neutral';
  timestamp: Date;
}

interface AdaptiveChatbotProps {
  currentEmotion: Emotion;
}

const emotionResponses = {
  happy: {
    greetings: ["That's wonderful to see you so happy! 😊", "Your positive energy is contagious!", "I love your upbeat mood!"],
    responses: ["That sounds amazing!", "How exciting!", "I'm so glad to hear that!", "Your enthusiasm is inspiring!"],
    tone: "enthusiastic",
    icon: Heart
  },
  sad: {
    greetings: ["I'm here for you. How can I help? 💙", "I notice you might be feeling down. I'm listening.", "Take your time, I'm here to support you."],
    responses: ["I understand that must be difficult.", "Your feelings are valid.", "Would you like to talk about it?", "I'm here to listen without judgment."],
    tone: "supportive",
    icon: Heart
  },
  angry: {
    greetings: ["I can sense some frustration. Let's work through this together.", "Take a deep breath. I'm here to help.", "What's bothering you? I'm listening."],
    responses: ["That sounds really frustrating.", "I can understand why you'd feel that way.", "Let's find a solution together.", "Your concerns are important."],
    tone: "calming",
    icon: Shield
  },
  surprised: {
    greetings: ["Wow! You seem surprised! What's happening?", "Something unexpected? Tell me more!", "I can sense the excitement!"],
    responses: ["That's incredible!", "What a surprise!", "How unexpected!", "That must have been quite a shock!"],
    tone: "energetic",
    icon: Zap
  },
  fearful: {
    greetings: ["You're safe here. I'm here to help you feel better.", "Everything will be okay. Let's talk.", "I'm here to support you through this."],
    responses: ["That sounds scary, but you're brave for sharing.", "It's okay to feel afraid sometimes.", "You're not alone in this.", "Let's take this one step at a time."],
    tone: "reassuring",
    icon: Shield
  },
  neutral: {
    greetings: ["Hello! How can I assist you today?", "Hi there! What's on your mind?", "Good to see you! How are you doing?"],
    responses: ["I see.", "That's interesting.", "Tell me more about that.", "How does that make you feel?"],
    tone: "balanced",
    icon: Lightbulb
  }
};

const sentiment = new Sentiment();

export const AdaptiveChatbot = ({ currentEmotion }: AdaptiveChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: emotionResponses[currentEmotion].greetings[0],
      isBot: true,
      emotion: currentEmotion,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Update greeting when emotion changes
  useEffect(() => {
    const newGreeting = emotionResponses[currentEmotion].greetings[
      Math.floor(Math.random() * emotionResponses[currentEmotion].greetings.length)
    ];
    
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        content: newGreeting,
        isBot: true,
        emotion: currentEmotion,
        timestamp: new Date()
      }
    ]);
  }, [currentEmotion]);

  const analyzeSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
    const result = sentiment.analyze(text);
    if (result.score > 0) return 'positive';
    if (result.score < 0) return 'negative';
    return 'neutral';
  };

  const generateResponse = (userMessage: string, userSentiment: 'positive' | 'negative' | 'neutral'): string => {
    const emotionData = emotionResponses[currentEmotion];
    const responses = emotionData.responses;
    
    // Adapt response based on sentiment and emotion
    if (userSentiment === 'negative' && currentEmotion === 'happy') {
      return "I hear that you're going through something difficult. Even though I sense some happiness, I want to acknowledge your concerns too.";
    }
    
    if (userSentiment === 'positive' && currentEmotion === 'sad') {
      return "I'm glad to hear some positivity in your words! That's a good sign, even when you're feeling down.";
    }

    // Default emotion-based response
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userSentiment = analyzeSentiment(inputValue);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      sentiment: userSentiment,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(inputValue, userSentiment),
        isBot: true,
        emotion: currentEmotion,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const EmotionIcon = emotionResponses[currentEmotion].icon;

  return (
    <Card className="w-full max-w-2xl h-[600px] flex flex-col theme-transition">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Emotion-Adaptive Assistant
          <Badge variant="outline" className="ml-auto flex items-center gap-1">
            <EmotionIcon className="h-3 w-3" />
            {emotionResponses[currentEmotion].tone}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                {message.isBot && (
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.isBot ? 'order-1' : 'order-2'}`}>
                  <div
                    className={`p-3 rounded-lg ${
                      message.isBot
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    {message.content}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                    {message.sentiment && (
                      <Badge variant="secondary" className="text-xs">
                        {message.sentiment}
                      </Badge>
                    )}
                    {message.emotion && (
                      <Badge variant="outline" className="text-xs">
                        {message.emotion}
                      </Badge>
                    )}
                  </div>
                </div>

                {!message.isBot && (
                  <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted text-muted-foreground p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-current rounded-full emotion-pulse" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-current rounded-full emotion-pulse" style={{ animationDelay: '200ms' }} />
                    <div className="w-2 h-2 bg-current rounded-full emotion-pulse" style={{ animationDelay: '400ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Share your thoughts... (${emotionResponses[currentEmotion].tone} mode)`}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};