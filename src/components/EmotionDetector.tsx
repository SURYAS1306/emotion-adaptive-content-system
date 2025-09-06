import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, CameraOff, Brain, Heart, Zap, Cloud, Moon, Flame } from "lucide-react";
import { analyzeEmotionApi, hasBackend, testBackendConnection } from "@/lib/api";

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
  const [error, setError] = useState<string | null>(null);
  const [backendConnected, setBackendConnected] = useState(false);
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Check backend connection on mount
  useEffect(() => {
    const checkBackend = async () => {
      if (!hasBackend) return;
      setIsCheckingBackend(true);
      try {
        const connected = await testBackendConnection();
        setBackendConnected(connected);
        if (connected) {
          setError(null);
        }
      } catch (e) {
        setBackendConnected(false);
      } finally {
        setIsCheckingBackend(false);
      }
    };
    
    checkBackend();
    // Check every 10 seconds
    const interval = setInterval(checkBackend, 10000);
    return () => clearInterval(interval);
  }, []);

  const startWebcam = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user'
        }, 
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
      }
      streamRef.current = stream;

      // Start periodic capture - more frequent for better responsiveness
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(captureAndAnalyze, 1000);
    } catch (e: any) {
      setError(e?.message || "Camera access denied");
      setIsActive(false);
    }
  };

  const stopWebcam = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    setConfidence(0);
  };

  const captureAndAnalyze = async () => {
    try {
      if (!videoRef.current || !canvasRef.current || !isActive) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, width, height);
      const blob: Blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b as Blob), "image/jpeg", 0.85));
      
      if (hasBackend && backendConnected) {
        try {
          const res = await analyzeEmotionApi(blob);
          const label = (res.emotion || "neutral").toLowerCase();
          const allowed: Emotion[] = ['neutral','happy','sad','angry','surprised','fearful'];
          
          if (allowed.includes(label as Emotion)) {
            onEmotionChange(label as Emotion);
          }
          
          if (res.confidence) {
            setConfidence(Math.min(100, Math.max(0, res.confidence)));
          }
          
          // Clear error if analysis succeeds
          setError(null);
        } catch (apiError: any) {
          // If API fails, fall back to simulation
          console.log('API failed, using simulation:', apiError.message);
          setBackendConnected(false);
          const allowed: Emotion[] = ['neutral','happy','sad','angry','surprised','fearful'];
          const shouldChange = Math.random() > 0.8; // 20% chance to change
          if (shouldChange) {
            const randomIndex = Math.floor(Math.random() * allowed.length);
            const next = allowed[randomIndex];
            onEmotionChange(next);
            setConfidence(75 + Math.random() * 25);
          }
        }
      } else {
        // Simulated rotation for demo when no backend - more realistic timing
        const allowed: Emotion[] = ['neutral','happy','sad','angry','surprised','fearful'];
        // More realistic emotion changes - don't change too frequently
        const shouldChange = Math.random() > 0.7; // 30% chance to change
        if (shouldChange) {
          const randomIndex = Math.floor(Math.random() * allowed.length);
          const next = allowed[randomIndex];
          onEmotionChange(next);
          setConfidence(80 + Math.random() * 20);
        } else {
          // Keep current emotion but update confidence slightly
          setConfidence(75 + Math.random() * 25);
        }
      }
    } catch (e: any) {
      // Soft-fail: keep previous emotion, show one-time error
      setError((prev) => prev || e?.message || "Analysis failed");
    }
  };

  const handleEmotionSelect = (emotion: Emotion) => {
    onEmotionChange(emotion);
    setConfidence(Math.random() * 20 + 80); // High confidence for manual selection
  };

  const toggleDetection = () => {
    const next = !isActive;
    setIsActive(next);
    if (next) {
      startWebcam();
    } else {
      stopWebcam();
    }
  };

  const currentEmotionData = emotions.find(e => e.id === currentEmotion);

  return (
    <Card className="w-full max-w-md theme-transition glass-panel border-2 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 emotion-glow" />
          Emotion Detection
          {isActive && <div className="ml-auto w-2 h-2 bg-green-400 rounded-full emotion-pulse" />}
        </CardTitle>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className={`w-2 h-2 rounded-full ${
            isCheckingBackend 
              ? 'bg-blue-500 animate-pulse' 
              : backendConnected 
                ? 'bg-green-500' 
                : hasBackend 
                  ? 'bg-red-500' 
                  : 'bg-yellow-500'
          }`} />
          {isCheckingBackend 
            ? 'Checking Backend...' 
            : backendConnected 
              ? 'Real AI Detection' 
              : hasBackend 
                ? 'Backend Disconnected' 
                : 'Simulation Mode'
          }
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Webcam Feed */}
        <div className="relative aspect-video bg-gradient-to-br from-muted/50 to-muted rounded-xl overflow-hidden border-2 border-border/50">
          <video 
            ref={videoRef} 
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
              isActive ? 'scale-100' : 'scale-100'
            }`} 
            muted 
            playsInline
            style={{ filter: isActive ? 'none' : 'blur(2px)' }}
          />
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/80 to-muted/60">
              <div className="text-center">
                <CameraOff className="h-16 w-16 mx-auto mb-3 text-muted-foreground/60" />
                <p className="text-sm text-muted-foreground font-medium">Camera inactive</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Click Start Detection to begin</p>
              </div>
              </div>
            )}
          
          {/* Analysis overlay */}
          {isActive && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-green-500/90 text-white border-0">
                  <div className="w-2 h-2 bg-white rounded-full mr-1 emotion-pulse" />
                  Analyzing...
                </Badge>
              </div>
            </div>
          )}
          
          {/* Live indicator */}
          {isActive && (
            <div className="absolute top-2 left-2">
              <Badge variant="destructive" className="flex items-center gap-1 bg-red-500/90 text-white border-0">
                <div className="w-2 h-2 bg-white rounded-full emotion-pulse" />
                LIVE
              </Badge>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Detection Toggle */}
        <Button 
          onClick={toggleDetection}
          variant={isActive ? "destructive" : "default"}
          className={`w-full h-12 text-base font-medium transition-all duration-300 ${
            isActive 
              ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25' 
              : 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25'
          }`}
        >
          {isActive ? (
            <>
              <CameraOff className="h-5 w-5 mr-2" />
              Stop Detection
            </>
          ) : (
            <>
              <Camera className="h-5 w-5 mr-2" />
              Start Detection
            </>
          )}
        </Button>

        {/* Current Emotion Display */}
        {currentEmotionData && (
          <div className={`flex items-center justify-between p-4 rounded-xl transition-all duration-500 ${
            isActive 
              ? 'bg-gradient-to-r from-accent to-accent/80 shadow-lg border-2 border-primary/30' 
              : 'bg-accent/50'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${currentEmotionData.color} text-white emotion-pulse`}>
              <currentEmotionData.icon className="h-5 w-5" />
              </div>
              <div>
                <span className="font-semibold text-lg">{currentEmotionData.label}</span>
                {isActive && (
                  <p className="text-xs text-muted-foreground">Detected in real-time</p>
                )}
              </div>
            </div>
            {confidence > 0 && (
              <Badge variant="secondary" className="text-sm font-medium">
                {confidence.toFixed(0)}% confidence
              </Badge>
            )}
          </div>
        )}

        {/* Manual Emotion Selection */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Manual Selection:</p>
          <div className="grid grid-cols-2 gap-2">
            {emotions.map((emotion) => (
              <Button
                key={emotion.id}
                variant={currentEmotion === emotion.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleEmotionSelect(emotion.id)}
                className={`flex items-center gap-2 justify-start h-10 transition-all duration-300 ${
                  currentEmotion === emotion.id 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'hover:bg-accent'
                }`}
              >
                <emotion.icon className="h-4 w-4" />
                {emotion.label}
              </Button>
            ))}
          </div>
          
          {/* Quick Test Button */}
          {isActive && (
            <div className="pt-2 border-t">
              <Button
                onClick={() => {
                  const allowed: Emotion[] = ['neutral','happy','sad','angry','surprised','fearful'];
                  const randomIndex = Math.floor(Math.random() * allowed.length);
                  const next = allowed[randomIndex];
                  onEmotionChange(next);
                  setConfidence(85 + Math.random() * 15);
                }}
                variant="outline"
                size="sm"
                className="w-full"
              >
                🎭 Test Random Emotion
              </Button>
            </div>
          )}
          
          {/* Backend Connection Button */}
          {hasBackend && !backendConnected && (
            <div className="pt-2 border-t">
              <Button
                onClick={async () => {
                  setIsCheckingBackend(true);
                  try {
                    const connected = await testBackendConnection();
                    setBackendConnected(connected);
                    if (connected) {
                      setError(null);
                    } else {
                      setError("Backend not responding. Make sure it's running on http://localhost:8000");
                    }
                  } catch (e) {
                    setError("Backend not responding. Make sure it's running on http://localhost:8000");
                  } finally {
                    setIsCheckingBackend(false);
                  }
                }}
                variant="outline"
                size="sm"
                className="w-full"
                disabled={isCheckingBackend}
              >
                {isCheckingBackend ? '🔄 Checking...' : '🔌 Retry Backend Connection'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};