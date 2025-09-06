#!/bin/bash

echo "🎨 Starting Feelix Flow Frontend"
echo

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Current directory: $(pwd)"
    echo "   Expected files: package.json"
    exit 1
fi

# Kill any existing processes on common frontend ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000,5173,8080,8081 | xargs kill -9 2>/dev/null || true

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install frontend dependencies"
        exit 1
    fi
fi

echo
echo "🎨 Starting React frontend with live emotion detection..."
echo "🌐 Frontend will be available at: http://localhost:8080 (or next available port)"
echo "🔗 Backend API: http://localhost:8000"
echo
echo "⚠️  Make sure the backend is running in another terminal"
echo "🛑 Press Ctrl+C to stop the frontend"
echo

# Start the frontend with the correct API base URL
VITE_API_BASE=http://localhost:8000 npm run dev
