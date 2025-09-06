from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
from io import BytesIO
from PIL import Image
import numpy as np
import cv2

# Optional heavy imports. Delay import for faster cold start if needed
try:
    from deepface import DeepFace  # type: ignore
    from deepface.commons import functions  # type: ignore
    print("✅ DeepFace imported successfully")
except Exception as e:  # pragma: no cover
    print(f"❌ DeepFace import failed: {e}")
    DeepFace = None  # type: ignore
    functions = None  # type: ignore

try:
    from textblob import TextBlob  # type: ignore
    print("✅ TextBlob imported successfully")
except Exception as e:  # pragma: no cover
    print(f"❌ TextBlob import failed: {e}")
    TextBlob = None  # type: ignore

app = FastAPI(title="Emotion-Adaptive Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SentimentRequest(BaseModel):
    text: str


@app.get("/health")
def health() -> Dict[str, Any]:
    return {"status": "ok"}


@app.post("/analyze/sentiment")
def analyze_sentiment(payload: SentimentRequest) -> Dict[str, Any]:
    if TextBlob is None:
        raise HTTPException(status_code=503, detail="TextBlob not available")

    blob = TextBlob(payload.text)
    polarity = float(blob.sentiment.polarity)
    if polarity > 0.05:
        label = "positive"
    elif polarity < -0.05:
        label = "negative"
    else:
        label = "neutral"
    return {"label": label, "polarity": polarity}


@app.post("/analyze/emotion")
async def analyze_emotion(file: UploadFile = File(...)) -> Dict[str, Any]:
    if DeepFace is None:
        raise HTTPException(status_code=503, detail="DeepFace not available")

    try:
        data = await file.read()
        image = Image.open(BytesIO(data)).convert("RGB")
        np_image = np.array(image)
        
        # Convert PIL image to OpenCV format
        cv_image = cv2.cvtColor(np_image, cv2.COLOR_RGB2BGR)
        
        # Preprocess image for better detection
        gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
        
        # Use OpenCV's Haar Cascade for face detection
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        
        if len(faces) == 0:
            return {
                "emotion": "neutral",
                "confidence": 0.0,
                "raw": {"emotion": {}},
                "message": "No face detected"
            }
        
        # Get the largest face
        largest_face = max(faces, key=lambda x: x[2] * x[3])
        x, y, w, h = largest_face
        
        # Crop face region
        face_roi = cv_image[y:y+h, x:x+w]
        
        # Resize face to standard size for DeepFace
        face_resized = cv2.resize(face_roi, (224, 224))
        
        # Convert back to RGB for DeepFace
        face_rgb = cv2.cvtColor(face_resized, cv2.COLOR_BGR2RGB)

        # DeepFace analyze with the cropped face
        result = DeepFace.analyze(
            img_path=face_rgb,
            actions=["emotion"],
            enforce_detection=False,
            detector_backend="opencv"
        )

        # DeepFace returns list or dict depending on version
        analysis = result[0] if isinstance(result, list) else result
        dominant_emotion = analysis.get("dominant_emotion", "neutral")
        emotions = analysis.get("emotion", {})
        confidence = float(max(emotions.values())) if emotions else 0.0

        return {
            "emotion": dominant_emotion,
            "confidence": confidence,
            "raw": {"emotion": emotions},
            "face_detected": True,
            "face_count": len(faces)
        }
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=400, detail=f"Failed to analyze emotion: {exc}")


