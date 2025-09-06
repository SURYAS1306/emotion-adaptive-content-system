#!/bin/bash

echo "🚀 Starting Feelix Flow - Complete System"
echo "========================================"
echo

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "backend/app.py" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Current directory: $(pwd)"
    echo "   Expected files: package.json, backend/app.py"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo
    echo "🛑 Shutting down services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
lsof -ti:8000,3000,5173,8080,8081 | xargs kill -9 2>/dev/null || true

# Start backend in background
echo "🔧 Starting backend..."
cd backend
python3 -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Test backend
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ Backend is running at http://localhost:8000"
else
    echo "❌ Backend failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Start frontend
echo "🎨 Starting frontend..."
VITE_API_BASE=http://localhost:8000 npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to start..."
sleep 3

echo
echo "🎉 Feelix Flow is now running!"
echo "==============================="
echo "🌐 Frontend: http://localhost:8080 (or next available port)"
echo "🔧 Backend:  http://localhost:8000"
echo "📖 API Docs: http://localhost:8000/docs"
echo
echo "🛑 Press Ctrl+C to stop all services"
echo

# Wait for user to stop
wait
