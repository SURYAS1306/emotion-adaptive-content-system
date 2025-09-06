#!/usr/bin/env python3
"""
Simple script to start the emotion detection backend
"""
import subprocess
import sys
import os

def main():
    # Change to backend directory
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    os.chdir(backend_dir)
    
    print("🚀 Starting Emotion Detection Backend...")
    print("📦 Installing dependencies...")
    
    # Install requirements
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], check=True)
        print("✅ Dependencies installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return
    
    print("🧠 Starting FastAPI server...")
    print("🌐 Backend will be available at: http://localhost:8000")
    print("📖 API docs at: http://localhost:8000/docs")
    print("🛑 Press Ctrl+C to stop")
    
    # Start the server
    try:
        subprocess.run([
            sys.executable, '-m', 'uvicorn', 
            'app:app', 
            '--host', '0.0.0.0', 
            '--port', '8000',
            '--reload'
        ])
    except KeyboardInterrupt:
        print("\n👋 Backend stopped")

if __name__ == "__main__":
    main()
