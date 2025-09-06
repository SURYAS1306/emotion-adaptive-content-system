#!/bin/bash

echo "🚀 Starting Live Emotion Detection System"
echo

# Check if we're in the right directory
if [ ! -f "backend/app.py" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Current directory: $(pwd)"
    echo "   Expected files: backend/app.py"
    exit 1
fi

# Kill any existing processes on port 8000
echo "🧹 Cleaning up existing processes..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true

echo "📦 Installing Python dependencies..."
cd backend

# Use the working requirements file
echo "🔄 Installing dependencies from requirements-fixed.txt..."
pip install -r requirements-fixed.txt
if [ $? -ne 0 ]; then
    echo "❌ Dependency installation failed"
    echo "💡 Try installing manually:"
    echo "   pip install fastapi uvicorn opencv-python-headless pillow numpy tensorflow deepface textblob"
    exit 1
fi

echo
echo "🧠 Starting FastAPI backend server..."
echo "🌐 Backend will be available at: http://localhost:8000"
echo "📖 API docs at: http://localhost:8000/docs"
echo
echo "⚠️  Keep this terminal open while using the app"
echo "🛑 Press Ctrl+C to stop the backend"
echo

python3 -c "
import uvicorn
from app import app
print('🚀 Starting FastAPI server...')
uvicorn.run(app, host='0.0.0.0', port=8000, reload=True)
"
