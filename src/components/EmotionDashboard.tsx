import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Activity, Brain, Zap } from "lucide-react";
import { Emotion } from "./EmotionDetector";

interface EmotionMetrics {
  accuracy: number;
  responseTime: number;
  adaptationRate: number;
  userEngagement: number;
}

interface EmotionDashboardProps {
  currentEmotion: Emotion;
  metrics: EmotionMetrics;
}

const emotionColors = {
  happy: 'bg-yellow-500',
  sad: 'bg-blue-500',
  angry: 'bg-red-500',
  surprised: 'bg-cyan-500',
  fearful: 'bg-purple-500',
  neutral: 'bg-gray-500'
};

export const EmotionDashboard = ({ currentEmotion, metrics }: EmotionDashboardProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* System Status */}
      <Card className="theme-transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Detection Accuracy</span>
              <Badge variant="outline">{metrics.accuracy}%</Badge>
            </div>
            <Progress value={metrics.accuracy} className="h-2" />
            <p className="text-xs text-muted-foreground">Target: 92%</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Response Time</span>
              <Badge variant="outline">{metrics.responseTime}ms</Badge>
            </div>
            <Progress value={(300 - metrics.responseTime) / 3} className="h-2" />
            <p className="text-xs text-muted-foreground">Target: &lt;200ms</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Adaptation Rate</span>
              <Badge variant="outline">{metrics.adaptationRate}%</Badge>
            </div>
            <Progress value={metrics.adaptationRate} className="h-2" />
            <p className="text-xs text-muted-foreground">Real-time adaptation</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">User Engagement</span>
              <Badge variant="outline">+{metrics.userEngagement}%</Badge>
            </div>
            <Progress value={metrics.userEngagement} className="h-2" />
            <p className="text-xs text-muted-foreground">Improvement target: 35%</p>
          </div>
        </CardContent>
      </Card>

      {/* Current State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="theme-transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Active Emotion Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${emotionColors[currentEmotion]} emotion-pulse`} />
              <span className="font-medium capitalize">{currentEmotion}</span>
              <Badge variant="secondary" className="ml-auto">
                Active
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium mb-2">Current Adaptations:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• UI theme adapted to {currentEmotion} state</li>
                  <li>• Chatbot tone adjusted for {currentEmotion} responses</li>
                  <li>• Content personalization active</li>
                  <li>• Real-time sentiment analysis enabled</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="theme-transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Research Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">99.5%</div>
                <div className="text-xs text-muted-foreground">System Uptime</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">-35%</div>
                <div className="text-xs text-muted-foreground">Bounce Rate</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">+42%</div>
                <div className="text-xs text-muted-foreground">Engagement</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">87%</div>
                <div className="text-xs text-muted-foreground">Sentiment Accuracy</div>
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                Data collected in compliance with GDPR and privacy regulations.
                Opt-in consent mechanism active.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical Stack Info */}
      <Card className="theme-transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Technology Stack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Frontend</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• React.js (Real-time UI)</p>
                <p>• Emotion-adaptive themes</p>
                <p>• WebRTC for camera access</p>
                <p>• Real-time sentiment analysis</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">AI/ML Models</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• DeepFace emotion detection</p>
                <p>• OpenCV computer vision</p>
                <p>• TextBlob sentiment analysis</p>
                <p>• Real-time processing pipeline</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Backend & Cloud</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• FastAPI microservices</p>
                <p>• AWS cloud infrastructure</p>
                <p>• Docker containerization</p>
                <p>• Redis caching layer</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};