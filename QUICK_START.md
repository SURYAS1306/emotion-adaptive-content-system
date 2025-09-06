# 🚀 Quick Start Guide for Live Emotion Detection

## Option 1: Automated Setup (Recommended)
```bash
# Run the startup script
./start_live_detection.sh
```

## Option 2: Manual Setup
If the automated script fails, try this step by step:

### 1. Install Python Dependencies
```bash
cd backend

# Try this minimal installation first
pip install fastapi uvicorn opencv-python-headless pillow numpy tensorflow deepface textblob

# If that fails, try without specific versions
pip install fastapi uvicorn opencv-python pillow numpy tensorflow deepface textblob
```

### 2. Start Backend
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Start Frontend (in new terminal)
```bash
VITE_API_BASE=http://localhost:8000 npm run dev
```

## Option 3: Simulation Mode (No Backend)
If you just want to test the UI without real emotion detection:
```bash
npm i
npm run dev
```

## Troubleshooting

### Python Version Issues
- Make sure you have Python 3.8-3.11 installed
- Check with: `python --version`

### TensorFlow Issues
- Try: `pip install tensorflow-cpu` instead of `tensorflow`
- Or: `pip install tensorflow==2.15.0`

### OpenCV Issues
- Try: `pip install opencv-python` instead of `opencv-python-headless`

### DeepFace Issues
- Try: `pip install deepface==0.0.79`

## What to Expect
- **Green dot**: Real AI detection working
- **Red dot**: Backend not running  
- **Yellow dot**: Simulation mode
- **Blue pulsing**: Checking connection

## Test the System
1. Open http://localhost:5173
2. Click "Start Detection"
3. Allow camera permissions
4. Make facial expressions
5. Watch emotions change in real-time!
