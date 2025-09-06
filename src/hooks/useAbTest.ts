import { useEffect, useState } from "react";

export type Variant = 'adaptive' | 'control';

export function useAbTest(key: string = 'ab-variant') {
  const [variant, setVariant] = useState<Variant>(() => {
    const saved = localStorage.getItem(key) as Variant | null;
    return saved || 'adaptive';
  });

  useEffect(() => {
    localStorage.setItem(key, variant);
  }, [key, variant]);

  const toggle = () => setVariant((v) => (v === 'adaptive' ? 'control' : 'adaptive'));

  return { variant, setVariant, toggle } as const;
}


