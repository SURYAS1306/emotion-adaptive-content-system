import { useState, useEffect } from 'react';

type AbTestVariant = 'adaptive' | 'control';

export const useAbTest = () => {
  const [variant, setVariant] = useState<AbTestVariant>('adaptive');

  // Load variant from localStorage on mount
  useEffect(() => {
    const savedVariant = localStorage.getItem('ab-test-variant') as AbTestVariant;
    if (savedVariant && (savedVariant === 'adaptive' || savedVariant === 'control')) {
      setVariant(savedVariant);
    } else {
      // Randomly assign variant if none saved
      const randomVariant = Math.random() > 0.5 ? 'adaptive' : 'control';
      setVariant(randomVariant);
      localStorage.setItem('ab-test-variant', randomVariant);
    }
  }, []);

  const toggle = () => {
    const newVariant = variant === 'adaptive' ? 'control' : 'adaptive';
    setVariant(newVariant);
    localStorage.setItem('ab-test-variant', newVariant);
  };

  return { variant, toggle };
};
