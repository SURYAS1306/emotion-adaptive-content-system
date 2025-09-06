#!/bin/bash

echo "🧪 Testing Feelix Flow System"
echo "============================="
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $2 -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
    fi
}

# Test backend health
echo "🔧 Testing Backend..."
BACKEND_RESPONSE=$(curl -s http://localhost:8000/health 2>/dev/null)
if [ "$BACKEND_RESPONSE" = '{"status":"ok"}' ]; then
    print_status "Backend is running and healthy" 0
else
    print_status "Backend is not responding" 1
    echo "   Response: $BACKEND_RESPONSE"
fi

# Test frontend
echo "🎨 Testing Frontend..."
FRONTEND_RESPONSE=$(curl -s http://localhost:8080 2>/dev/null | head -1)
if [[ "$FRONTEND_RESPONSE" == *"<!DOCTYPE html>"* ]]; then
    print_status "Frontend is running" 0
else
    print_status "Frontend is not responding" 1
    echo "   Response: $FRONTEND_RESPONSE"
fi

# Test emotion detection endpoint
echo "🎭 Testing Emotion Detection API..."
EMOTION_RESPONSE=$(curl -s -X POST http://localhost:8000/analyze/emotion 2>/dev/null)
if [[ "$EMOTION_RESPONSE" == *"Method Not Allowed"* ]]; then
    print_status "Emotion detection endpoint is accessible" 0
else
    print_status "Emotion detection endpoint issue" 1
    echo "   Response: $EMOTION_RESPONSE"
fi

# Test sentiment analysis endpoint
echo "💭 Testing Sentiment Analysis API..."
SENTIMENT_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"text":"I am happy"}' http://localhost:8000/analyze/sentiment 2>/dev/null)
if [[ "$SENTIMENT_RESPONSE" == *"label"* ]]; then
    print_status "Sentiment analysis is working" 0
    echo "   Sample response: $SENTIMENT_RESPONSE"
else
    print_status "Sentiment analysis issue" 1
    echo "   Response: $SENTIMENT_RESPONSE"
fi

echo
echo "🌐 System URLs:"
echo "   Frontend: http://localhost:8080"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo

# Check if both services are running
if curl -s http://localhost:8000/health > /dev/null && curl -s http://localhost:8080 > /dev/null; then
    echo -e "${GREEN}🎉 System is fully operational!${NC}"
    echo "   You can now open http://localhost:8080 in your browser"
    echo "   and test the emotion detection with your webcam."
else
    echo -e "${YELLOW}⚠️  Some services may not be running properly.${NC}"
    echo "   Try running: ./start_all.sh"
fi
