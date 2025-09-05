import { createContext, useContext, useEffect, useState } from "react";
import { Emotion } from "./EmotionDetector";

interface EmotionThemeContextType {
  currentEmotion: Emotion;
  setEmotion: (emotion: Emotion) => void;
  themeClass: string;
}

const EmotionThemeContext = createContext<EmotionThemeContextType | undefined>(undefined);

export const useEmotionTheme = () => {
  const context = useContext(EmotionThemeContext);
  if (!context) {
    throw new Error("useEmotionTheme must be used within EmotionThemeProvider");
  }
  return context;
};

interface EmotionThemeProviderProps {
  children: React.ReactNode;
}

export const EmotionThemeProvider = ({ children }: EmotionThemeProviderProps) => {
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('neutral');

  const getThemeClass = (emotion: Emotion): string => {
    return `theme-${emotion}`;
  };

  const setEmotion = (emotion: Emotion) => {
    setCurrentEmotion(emotion);
  };

  const themeClass = getThemeClass(currentEmotion);

  // Apply theme to document body
  useEffect(() => {
    const body = document.body;
    
    // Remove all existing theme classes
    body.classList.remove(
      'theme-neutral',
      'theme-happy', 
      'theme-sad',
      'theme-angry',
      'theme-surprised',
      'theme-fearful'
    );
    
    // Add current theme class
    body.classList.add(themeClass, 'theme-transition');
    
    return () => {
      body.classList.remove(themeClass, 'theme-transition');
    };
  }, [themeClass]);

  return (
    <EmotionThemeContext.Provider value={{ currentEmotion, setEmotion, themeClass }}>
      <div className={`${themeClass} theme-transition`}>
        {children}
      </div>
    </EmotionThemeContext.Provider>
  );
};