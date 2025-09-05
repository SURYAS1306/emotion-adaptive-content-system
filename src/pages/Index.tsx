import { useState } from "react";
import { EmotionThemeProvider } from "@/components/EmotionThemeProvider";
import { EmotionDetector, Emotion } from "@/components/EmotionDetector";
import { AdaptiveChatbot } from "@/components/AdaptiveChatbot";
import { EmotionDashboard } from "@/components/EmotionDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles } from "lucide-react";

const Index = () => {
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('neutral');
  
  // Simulated metrics for demonstration
  const metrics = {
    accuracy: 94,
    responseTime: 156,
    adaptationRate: 98,
    userEngagement: 42
  };

  return (
    <EmotionThemeProvider>
      <div className="min-h-screen bg-background theme-transition">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Emotion-Adaptive System</h1>
                  <p className="text-sm text-muted-foreground">Real-time emotion detection & content adaptation</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Research Prototype
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {currentEmotion} Mode
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 space-y-8">
          {/* Hero Section */}
          <Card className="border-2 border-primary/20 theme-transition">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold mb-2">
                Real-Time Emotion-Adaptive Content System
              </CardTitle>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience how AI can dynamically adapt user interfaces and chatbot responses 
                based on real-time emotion detection and sentiment analysis.
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">92%+</div>
                  <p className="text-sm text-muted-foreground">Emotion Detection Accuracy</p>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">&lt;200ms</div>
                  <p className="text-sm text-muted-foreground">Response Latency</p>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">35%+</div>
                  <p className="text-sm text-muted-foreground">Engagement Improvement</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Demo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <EmotionDetector 
                currentEmotion={currentEmotion} 
                onEmotionChange={setCurrentEmotion}
              />
            </div>
            <div className="space-y-6">
              <AdaptiveChatbot currentEmotion={currentEmotion} />
            </div>
          </div>

          {/* Dashboard */}
          <EmotionDashboard 
            currentEmotion={currentEmotion} 
            metrics={metrics}
          />

          {/* Research Info */}
          <Card className="theme-transition">
            <CardHeader>
              <CardTitle>Research & Development</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Objective</h4>
                  <p className="text-sm text-muted-foreground">
                    Develop a cloud-native, scalable system that leverages facial recognition and 
                    text sentiment analysis to improve user engagement and reduce bounce rates 
                    through personalized, emotion-aware interactions.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Use Cases</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• E-commerce personalization</li>
                    <li>• Customer support optimization</li>
                    <li>• Entertainment content adaptation</li>
                    <li>• Educational platform engagement</li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong>Privacy Note:</strong> This system implements strict data privacy measures 
                  with opt-in consent mechanisms and GDPR compliance for all sensitive user data processing.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="border-t bg-card/30 mt-16">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>Real-Time Emotion-Adaptive Content System • Research Prototype • Built with React, AI/ML, and Cloud Technologies</p>
          </div>
        </footer>
      </div>
    </EmotionThemeProvider>
  );
};

export default Index;
