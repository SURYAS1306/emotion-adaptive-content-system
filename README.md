# Real-Time Emotion-Adaptive Content System

A cutting-edge web application that dynamically adjusts UI themes and chatbot responses based on real-time emotion detection and sentiment analysis.

## 🎯 Features

- **Real-time Emotion Detection**: Uses DeepFace and OpenCV for facial emotion recognition
- **Sentiment Analysis**: TextBlob-powered sentiment analysis for chat interactions
- **Adaptive UI**: Dynamic theme changes based on detected emotions
- **Intelligent Chatbot**: Emotion-aware responses that adapt to user's emotional state
- **A/B Testing**: Built-in A/B testing framework for research purposes
- **Privacy-First**: GDPR-compliant with opt-in consent mechanisms

## 🛠️ Tech Stack

### Frontend
- React.js with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- shadcn/ui components
- WebRTC for camera access

### Backend
- FastAPI (Python)
- DeepFace for emotion detection
- OpenCV for computer vision
- TextBlob for sentiment analysis
- Uvicorn ASGI server

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Modern web browser with camera access

### 1. Clone and Setup
```bash
git clone <repository-url>
cd feelix-flow
```

### 2. One-Command Setup (Recommended)
```bash
./start_complete_system.sh
```

This script will:
- Install all dependencies
- Start the backend server
- Start the frontend development server
- Run comprehensive tests
- Provide access URLs

### 3. Manual Setup (Alternative)

#### Backend
```bash
cd backend
pip install -r requirements-fixed.txt
python3 -c "
import uvicorn
from app import app
uvicorn.run(app, host='0.0.0.0', port=8000, reload=True)
"
```

#### Frontend
```bash
VITE_API_BASE=http://localhost:8000 npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📱 Usage

1. **Open the application** in your browser
2. **Allow camera access** when prompted
3. **Click "Start Detection"** to begin emotion analysis
4. **Watch the UI adapt** to your emotions in real-time
5. **Chat with the adaptive chatbot** to see sentiment-aware responses

## 🧪 Testing

Run the comprehensive test suite:
```bash
python3 test_complete_system.py
```

This will test:
- Backend health and connectivity
- Emotion detection API
- Sentiment analysis API
- Frontend-backend integration

## 🚀 Deployment

### GitHub Pages (Frontend Only)
The frontend can be deployed to GitHub Pages for demonstration purposes:

1. Push code to GitHub
2. Enable GitHub Pages in repository settings
3. The workflow will automatically deploy

### Full Deployment
For production deployment with backend:

1. Deploy backend to cloud provider (AWS, GCP, Azure)
2. Update `VITE_API_BASE` environment variable
3. Deploy frontend to CDN or static hosting

## 🏗️ Development

### Project Structure
```
feelix-flow/
├── backend/                     # FastAPI backend
│   ├── app.py                  # Main application
│   ├── requirements.txt        # Dependencies
│   └── requirements-fixed.txt  # Compatible versions
├── src/                        # React frontend
│   ├── components/             # React components
│   │   ├── EmotionDetector.tsx # Webcam emotion detection
│   │   ├── AdaptiveChatbot.tsx # Emotion-aware chatbot
│   │   ├── EmotionThemeProvider.tsx # Global state
│   │   └── EmotionDashboard.tsx # Metrics display
│   ├── hooks/                  # Custom hooks
│   │   └── useAbTest.tsx      # A/B testing
│   ├── lib/                   # Utilities
│   │   └── api.ts             # API client
│   └── pages/                 # Page components
├── start_complete_system.sh   # Complete startup script
├── test_complete_system.py     # System tests
└── README.md                  # This file
```

### Key Components

- **EmotionDetector**: Webcam-based emotion detection with real-time analysis
- **AdaptiveChatbot**: Emotion-aware chat interface with sentiment analysis
- **EmotionThemeProvider**: Global emotion state management and theme switching
- **EmotionDashboard**: Real-time metrics and analytics display

## 🔬 Research Features

This system includes research-ready features for academic evaluation:

- **Quantitative Metrics**: Accuracy, response time, engagement rates
- **A/B Testing**: Compare adaptive vs. control variants
- **User-Centered Design**: Usability testing framework
- **Performance Evaluation**: Benchmarking against standard datasets

## 🔒 Privacy & Ethics

- **Opt-in Consent**: Explicit user consent for camera and data processing
- **GDPR Compliance**: Privacy-first data handling
- **Local Processing**: Sensitive data processed locally when possible
- **Transparent AI**: Clear indication of AI processing and adaptation

## 🛠️ Troubleshooting

### Common Issues

1. **Camera Access Denied**
   - Ensure browser has camera permissions
   - Try refreshing the page
   - Check browser security settings

2. **Backend Connection Failed**
   - Verify backend is running on port 8000
   - Check firewall settings
   - Ensure no other services are using port 8000

3. **Dependency Installation Issues**
   - Use `requirements-fixed.txt` for compatible versions
   - Ensure Python 3.11+ is installed
   - Try creating a virtual environment

4. **Emotion Detection Not Working**
   - Ensure good lighting conditions
   - Position face clearly in camera view
   - Check browser console for errors

### Getting Help

- Check the API documentation at http://localhost:8000/docs
- Run the test suite to diagnose issues: `python3 test_complete_system.py`
- Review browser console for frontend errors
- Check backend logs for server-side issues

## 📊 System Status

The system has been tested and verified to work with:
- ✅ Backend health and API endpoints
- ✅ Emotion detection with DeepFace
- ✅ Sentiment analysis with TextBlob
- ✅ Frontend-backend integration
- ✅ Real-time UI adaptation
- ✅ Camera-based emotion detection

## 📄 License

This project is for research and educational purposes. Please ensure compliance with local privacy laws when deploying.

## 🤝 Contributing

This is a research prototype. For contributions or questions, please contact the development team.

---

**Ready to experience emotion-adaptive technology? Run `./start_complete_system.sh` and open http://localhost:5173!**