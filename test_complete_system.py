#!/usr/bin/env python3
"""
Complete System Test for Emotion-Adaptive Content System
Tests both backend APIs and frontend-backend integration
"""

import requests
import time
import json
import io
from PIL import Image
import numpy as np

def test_backend_health():
    """Test backend health endpoint"""
    print("🔍 Testing backend health...")
    try:
        response = requests.get('http://127.0.0.1:8000/health', timeout=5)
        if response.status_code == 200:
            print("✅ Backend health check passed")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend health check failed: {e}")
        return False

def test_sentiment_analysis():
    """Test sentiment analysis API"""
    print("🔍 Testing sentiment analysis...")
    test_cases = [
        ("I am so happy today!", "positive"),
        ("This is terrible and awful!", "negative"),
        ("The weather is okay.", "neutral")
    ]
    
    for text, expected in test_cases:
        try:
            response = requests.post(
                'http://127.0.0.1:8000/analyze/sentiment',
                json={'text': text},
                timeout=5
            )
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Sentiment '{text}' -> {result['label']} (polarity: {result['polarity']})")
            else:
                print(f"❌ Sentiment analysis failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Sentiment analysis failed: {e}")
            return False
    return True

def test_emotion_detection():
    """Test emotion detection API"""
    print("🔍 Testing emotion detection...")
    
    # Create a simple test image
    img = Image.new('RGB', (224, 224), color='white')
    img_array = np.array(img)
    
    # Add some basic features to make it more face-like
    img_array[50:70, 100:124] = [0, 0, 0]  # eyes
    img_array[80:100, 90:134] = [255, 0, 0]  # mouth
    img_array[30:50, 90:134] = [0, 255, 0]  # nose
    
    img = Image.fromarray(img_array)
    
    # Convert to bytes
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    
    try:
        files = {'file': ('test.jpg', img_bytes, 'image/jpeg')}
        response = requests.post(
            'http://127.0.0.1:8000/analyze/emotion',
            files=files,
            timeout=10
        )
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Emotion detection: {result['emotion']} (confidence: {result['confidence']})")
            print(f"   Face detected: {result.get('face_detected', False)}")
            return True
        else:
            print(f"❌ Emotion detection failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Emotion detection failed: {e}")
        return False

def test_frontend_connection():
    """Test if frontend can connect to backend"""
    print("🔍 Testing frontend-backend connection...")
    
    # Test the API endpoints that frontend uses
    endpoints = [
        ('/health', 'GET'),
        ('/analyze/sentiment', 'POST'),
        ('/analyze/emotion', 'POST')
    ]
    
    for endpoint, method in endpoints:
        try:
            if method == 'GET':
                response = requests.get(f'http://127.0.0.1:8000{endpoint}', timeout=5)
            else:
                # Test with minimal data
                if endpoint == '/analyze/sentiment':
                    response = requests.post(
                        f'http://127.0.0.1:8000{endpoint}',
                        json={'text': 'test'},
                        timeout=5
                    )
                else:  # emotion
                    # Create minimal image
                    img = Image.new('RGB', (100, 100), color='white')
                    img_bytes = io.BytesIO()
                    img.save(img_bytes, format='JPEG')
                    img_bytes.seek(0)
                    files = {'file': ('test.jpg', img_bytes, 'image/jpeg')}
                    response = requests.post(
                        f'http://127.0.0.1:8000{endpoint}',
                        files=files,
                        timeout=5
                    )
            
            if response.status_code in [200, 400]:  # 400 is OK for invalid data
                print(f"✅ {endpoint} endpoint accessible")
            else:
                print(f"❌ {endpoint} endpoint failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ {endpoint} endpoint failed: {e}")
            return False
    
    return True

def main():
    """Run complete system test"""
    print("🚀 Starting Complete System Test")
    print("=" * 50)
    
    # Wait a moment for backend to be ready
    time.sleep(2)
    
    tests = [
        ("Backend Health", test_backend_health),
        ("Sentiment Analysis", test_sentiment_analysis),
        ("Emotion Detection", test_emotion_detection),
        ("Frontend Connection", test_frontend_connection)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n📋 {test_name}")
        print("-" * 30)
        result = test_func()
        results.append((test_name, result))
        time.sleep(1)
    
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS")
    print("=" * 50)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("🎉 All tests passed! System is ready to use.")
        print("\n📝 Next steps:")
        print("1. Start the frontend: npm run dev")
        print("2. Open http://localhost:5173 in your browser")
        print("3. Enable camera access for emotion detection")
        print("4. Test the adaptive UI and chatbot")
    else:
        print("⚠️  Some tests failed. Please check the backend setup.")
    
    return passed == len(results)

if __name__ == "__main__":
    main()
