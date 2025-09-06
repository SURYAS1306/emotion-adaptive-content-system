const API_BASE = (import.meta as any).env?.VITE_API_BASE || "";
export const hasBackend = Boolean(API_BASE);

// Test backend connection
export async function testBackendConnection(): Promise<boolean> {
  if (!hasBackend) return false;
  try {
    const response = await fetch(`${API_BASE}/health`, { 
      method: 'GET',
      signal: AbortSignal.timeout(3000) // 3 second timeout
    });
    return response.ok;
  } catch {
    return false;
  }
}

export type SentimentLabel = 'positive' | 'negative' | 'neutral';

export async function analyzeSentimentApi(text: string): Promise<{ label: SentimentLabel; polarity: number }> {
  if (!hasBackend) throw new Error("No backend configured");
  const res = await fetch(`${API_BASE}/analyze/sentiment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error(`Sentiment API error: ${res.status}`);
  return res.json();
}

export async function analyzeEmotionApi(blob: Blob): Promise<{ emotion: string; confidence: number }> {
  if (!hasBackend) throw new Error("No backend configured");
  const form = new FormData();
  form.append('file', blob, 'frame.jpg');
  const res = await fetch(`${API_BASE}/analyze/emotion`, {
    method: 'POST',
    body: form
  });
  if (!res.ok) throw new Error(`Emotion API error: ${res.status}`);
  return res.json();
}


