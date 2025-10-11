#!/bin/bash

# HangHub Development Startup Script
echo "🚀 Starting HangHub Development Environment"

# Function to kill processes on exit
cleanup() {
    echo "🛑 Stopping servers..."
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null
    fi
    if [ ! -z "$EXPO_PID" ]; then
        kill $EXPO_PID 2>/dev/null
    fi
    exit 0
}

# Set up cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start Backend Server
echo "📡 Starting Backend Server..."
cd server
npm start &
SERVER_PID=$!
echo "✅ Backend server started (PID: $SERVER_PID)"

# Wait a moment for server to start
sleep 3

# Test server connection
echo "🔍 Testing server connection..."
if curl -s http://localhost:3000/ > /dev/null; then
    echo "✅ Backend server is responding"
else
    echo "❌ Backend server is not responding"
    exit 1
fi

# Start Expo App
echo "📱 Starting Expo App with tunnel mode..."
cd ../MyProject
npx expo start --tunnel &
EXPO_PID=$!
echo "✅ Expo app started (PID: $EXPO_PID)"

echo ""
echo "🎉 Both services are running!"
echo "📡 Backend: http://localhost:3000"
echo "📱 Expo: Check terminal for QR code"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait