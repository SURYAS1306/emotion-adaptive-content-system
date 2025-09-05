import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, CameraOff, Brain, Heart, Zap, Cloud, Moon, Flame } from "lucide-react";

export type Emotion = 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised' | 'fearful';

interface EmotionDetectorProps {
  onEmotionChange: (emotion: Emotion) => void;
  currentEmotion: Emotion;
}

const emotions = [
  { id: 'neutral' as Emotion, label: 'Neutral', icon: Brain, color: 'bg-gray-500' },
  { id: 'happy' as Emotion, label: 'Happy', icon: Heart, color: 'bg-yellow-500' },
  { id: 'sad' as Emotion, label: 'Sad', icon: Cloud, color: 'bg-blue-500' },
  { id: 'angry' as Emotion, label: 'Angry', icon: Flame, color: 'bg-red-500' },
  { id: 'surprised' as Emotion, label: 'Surprised', icon: Zap, color: 'bg-cyan-500' },
  { id: 'fearful' as Emotion, label: 'Fearful', icon: Moon, color: 'bg-purple-500' },
];

export const EmotionDetector = ({ onEmotionChange, currentEmotion }: EmotionDetectorProps) => {
  const [isActive, setIsActive] = useState(false);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    if (isActive) {
      // Simulate emotion detection with random confidence
      const interval = setInterval(() => {
        setConfidence(Math.random() * 40 + 60); // 60-100% confidence
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const handleEmotionSelect = (emotion: Emotion) => {
    onEmotionChange(emotion);
    setConfidence(Math.random() * 20 + 80); // High confidence for manual selection
  };

  const toggleDetection = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setConfidence(0);
    }
  };

  const currentEmotionData = emotions.find(e => e.id === currentEmotion);

  return (
    <Card className="w-full max-w-md theme-transition">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Emotion Detection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Webcam Placeholder */}
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {isActive ? (
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-2 text-primary emotion-pulse" />
                <p className="text-sm text-muted-foreground">Analyzing emotions...</p>
              </div>
            ) : (
              <div className="text-center">
                <CameraOff className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Camera inactive</p>
              </div>
            )}
          </div>
          
          {/* Live indicator */}
          {isActive && (
            <div className="absolute top-2 left-2">
              <Badge variant="destructive" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-400 rounded-full emotion-pulse" />
                LIVE
              </Badge>
            </div>
          )}
        </div>

        {/* Detection Toggle */}
        <Button 
          onClick={toggleDetection}
          variant={isActive ? "destructive" : "default"}
          className="w-full"
        >
          {isActive ? (
            <>
              <CameraOff className="h-4 w-4 mr-2" />
              Stop Detection
            </>
          ) : (
            <>
              <Camera className="h-4 w-4 mr-2" />
              Start Detection
            </>
          )}
        </Button>

        {/* Current Emotion Display */}
        {currentEmotionData && (
          <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
            <div className="flex items-center gap-2">
              <currentEmotionData.icon className="h-5 w-5" />
              <span className="font-medium">{currentEmotionData.label}</span>
            </div>
            {confidence > 0 && (
              <Badge variant="secondary">
                {confidence.toFixed(0)}% confidence
              </Badge>
            )}
          </div>
        )}

        {/* Manual Emotion Selection */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Manual Selection:</p>
          <div className="grid grid-cols-2 gap-2">
            {emotions.map((emotion) => (
              <Button
                key={emotion.id}
                variant={currentEmotion === emotion.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleEmotionSelect(emotion.id)}
                className="flex items-center gap-2 justify-start"
              >
                <emotion.icon className="h-4 w-4" />
                {emotion.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};