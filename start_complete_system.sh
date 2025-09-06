#!/bin/bash

echo "🚀 Starting Complete Emotion-Adaptive Content System"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "backend/app.py" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Current directory: $(pwd)"
    echo "   Expected files: backend/app.py"
    exit 1
fi

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python 3.11+ first."
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "📦 Installing backend dependencies..."
cd backend

# Install Python dependencies
echo "🔄 Installing Python dependencies..."
pip install -r requirements-fixed.txt
if [ $? -ne 0 ]; then
    echo "❌ Backend dependency installation failed"
    echo "💡 Try installing manually:"
    echo "   pip install fastapi uvicorn opencv-python-headless pillow numpy tensorflow deepface textblob"
    exit 1
fi

echo "✅ Backend dependencies installed"

# Start backend in background
echo "🧠 Starting FastAPI backend server..."
python3 -c "
import uvicorn
from app import app
print('🚀 Starting FastAPI server...')
uvicorn.run(app, host='0.0.0.0', port=8000, reload=False)
" &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 8

# Test backend health
echo "🔍 Testing backend health..."
for i in {1..10}; do
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo "✅ Backend is running on http://localhost:8000"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "❌ Backend failed to start properly"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    sleep 2
done

# Go back to project root
cd ..

echo "📦 Installing frontend dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Frontend dependency installation failed"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
fi

echo "✅ Frontend dependencies installed"

# Set environment variable for backend connection
export VITE_API_BASE=http://localhost:8000

echo "🌐 Starting frontend development server..."
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to start..."
sleep 5

# Test frontend
echo "🔍 Testing frontend..."
for i in {1..10}; do
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo "✅ Frontend is running on http://localhost:5173"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "❌ Frontend failed to start properly"
        kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
        exit 1
    fi
    sleep 2
done

echo ""
echo "🎉 System is ready!"
echo "=================="
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:8000"
echo "📖 API Docs: http://localhost:8000/docs"
echo ""
echo "📝 Instructions:"
echo "1. Open http://localhost:5173 in your browser"
echo "2. Allow camera access when prompted"
echo "3. Click 'Start Detection' to begin emotion analysis"
echo "4. Watch the UI adapt to your emotions in real-time!"
echo ""
echo "🛑 Press Ctrl+C to stop both servers"

# Run comprehensive test
echo "🧪 Running system tests..."
python3 test_complete_system.py

# Keep script running and handle cleanup
trap 'echo ""; echo "🛑 Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true; echo "✅ Servers stopped"; exit 0' INT

# Wait for user to stop
wait
