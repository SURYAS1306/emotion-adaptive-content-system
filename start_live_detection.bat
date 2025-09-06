@echo off
echo 🚀 Starting Live Emotion Detection System
echo.

REM Check if we're in the right directory
if not exist "backend\app.py" (
    echo ❌ Error: Please run this script from the project root directory
    echo    Current directory: %CD%
    echo    Expected files: backend\app.py
    pause
    exit /b 1
)

REM Kill any existing processes on port 8000
echo 🧹 Cleaning up existing processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do taskkill /PID %%a /F 2>nul

echo 📦 Installing Python dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ⚠️  Main requirements failed, trying simple version...
    pip install -r requirements-simple.txt
    if %errorlevel% neq 0 (
        echo ⚠️  Simple requirements failed, trying minimal version...
        pip install -r requirements-minimal.txt
        if %errorlevel% neq 0 (
            echo ❌ All dependency installation attempts failed
            echo 💡 Try installing manually:
            echo    pip install fastapi uvicorn opencv-python-headless pillow numpy tensorflow deepface textblob
            pause
            exit /b 1
        )
    )
)

echo.
echo 🧠 Starting FastAPI backend server...
echo 🌐 Backend will be available at: http://localhost:8000
echo 📖 API docs at: http://localhost:8000/docs
echo.
echo ⚠️  Keep this window open while using the app
echo 🛑 Press Ctrl+C to stop the backend
echo.

python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
