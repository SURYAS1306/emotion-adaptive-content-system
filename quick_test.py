#!/usr/bin/env python3
"""
Quick test script for Feelix Flow system
Tests both backend and frontend connectivity
"""

import requests
import json
import time
import sys

def test_backend():
    """Test backend health and API endpoints"""
    print("🔧 Testing Backend...")
    
    # Test health endpoint
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend health check passed")
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend not reachable: {e}")
        return False
    
    # Test sentiment analysis
    try:
        response = requests.post(
            "http://localhost:8000/analyze/sentiment",
            json={"text": "I am very happy today!"},
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Sentiment analysis working: {data}")
        else:
            print(f"⚠️  Sentiment analysis issue: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"⚠️  Sentiment analysis error: {e}")
    
    return True

def test_frontend():
    """Test frontend accessibility"""
    print("🎨 Testing Frontend...")
    
    try:
        response = requests.get("http://localhost:8080", timeout=5)
        if response.status_code == 200 and "html" in response.text.lower():
            print("✅ Frontend is accessible")
            return True
        else:
            print(f"❌ Frontend issue: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Frontend not reachable: {e}")
        return False

def main():
    print("🧪 Feelix Flow System Test")
    print("=" * 30)
    print()
    
    backend_ok = test_backend()
    frontend_ok = test_frontend()
    
    print()
    if backend_ok and frontend_ok:
        print("🎉 System is fully operational!")
        print("🌐 Open http://localhost:8080 in your browser")
        print("🎭 Test emotion detection with your webcam")
        return 0
    else:
        print("⚠️  Some issues detected. Check the logs above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
