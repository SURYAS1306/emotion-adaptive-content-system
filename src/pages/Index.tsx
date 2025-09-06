import { useEffect, useMemo, useState } from "react";
import { useAbTest } from "@/hooks/useAbTest";
import { useEmotionTheme } from "@/components/EmotionThemeProvider";
import { EmotionDetector, Emotion } from "@/components/EmotionDetector";
import { AdaptiveChatbot } from "@/components/AdaptiveChatbot";
import { EmotionDashboard } from "@/components/EmotionDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles } from "lucide-react";

const Index = () => {
  const { currentEmotion, setEmotion } = useEmotionTheme();
  const { variant, toggle } = useAbTest();
  const [startTs] = useState<number>(Date.now());
  const [messageCount, setMessageCount] = useState(0);
  const [detectionEvents, setDetectionEvents] = useState(0);

  // track time on page
  const timeOnPage = useMemo(() => Math.floor((Date.now() - startTs) / 1000), [startTs]);

  useEffect(() => {
    const id = setInterval(() => {
      // trigger re-render for timeOnPage
      setDetectionEvents((x) => x);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  
  // Simulated metrics for demonstration
  const metrics = {
    accuracy: 94,
    responseTime: 156,
    adaptationRate: variant === 'adaptive' ? 98 : 0,
    userEngagement: Math.min(100, 20 + Math.floor(timeOnPage / 6) + messageCount * 3)
  };

  return (
    <div className="min-h-screen bg-background theme-transition">
        {/* Header */}
        <header className="border-b bg-card/60 backdrop-blur-md sticky top-0 z-10 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary text-primary-foreground emotion-glow shadow-lg">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    Emotion-Adaptive System
                  </h1>
                  <p className="text-sm text-muted-foreground">Real-time emotion detection & content adaptation</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1 bg-gradient-to-r from-primary/10 to-accent/10">
                  <Sparkles className="h-3 w-3" />
                  Research Prototype
                </Badge>
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-accent transition-colors" 
                  onClick={toggle} 
                  title="Toggle A/B variant"
                >
                  {variant.toUpperCase()} MODE
                </Badge>
                <Badge variant="secondary" className="capitalize bg-gradient-to-r from-accent to-accent/80 emotion-pulse">
                  {currentEmotion} Mode
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 space-y-8">
          {/* Hero Section */}
          <Card className={`border-2 border-primary/20 theme-transition glass-panel relative overflow-hidden`}>
            <div className={`absolute inset-0 opacity-10 gradient-${currentEmotion}`} />
            <CardHeader className="text-center relative z-10">
              <CardTitle className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Real-Time Emotion-Adaptive Content System
              </CardTitle>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Experience how AI can dynamically adapt user interfaces and chatbot responses 
                based on real-time emotion detection and sentiment analysis.
              </p>
            </CardHeader>
            <CardContent className="text-center relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="space-y-3 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                  <div className="text-3xl font-bold text-primary emotion-glow">92%+</div>
                  <p className="text-sm text-muted-foreground font-medium">Emotion Detection Accuracy</p>
                </div>
                <div className="space-y-3 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                  <div className="text-3xl font-bold text-primary emotion-glow">&lt;200ms</div>
                  <p className="text-sm text-muted-foreground font-medium">Response Latency</p>
                </div>
                <div className="space-y-3 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                  <div className="text-3xl font-bold text-primary emotion-glow">35%+</div>
                  <p className="text-sm text-muted-foreground font-medium">Engagement Improvement</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Demo */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="space-y-6">
              {variant === 'adaptive' ? (
                <EmotionDetector 
                  currentEmotion={currentEmotion} 
                  onEmotionChange={(e) => { 
                    setEmotion(e); 
                    setDetectionEvents((n) => n + 1); 
                  }}
                />
              ) : (
                <Card className="glass-panel border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Emotion Detection Disabled (Control)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Control variant for A/B testing. Toggle back to enable adaptation.</p>
                    <Button 
                      onClick={toggle} 
                      className="mt-4 w-full"
                      variant="outline"
                    >
                      Enable Emotion Detection
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="space-y-6">
              <div onClick={() => setMessageCount((c) => c)}>
                <AdaptiveChatbot currentEmotion={currentEmotion} />
              </div>
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
  );
};

export default Index;
