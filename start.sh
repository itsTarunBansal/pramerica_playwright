#!/bin/bash

echo "========================================"
echo "Starting AI Insurance Test Copilot"
echo "========================================"
echo ""

echo "[1/4] Checking MongoDB..."
if pgrep -x "mongod" > /dev/null; then
    echo "MongoDB is running"
else
    echo "Starting MongoDB..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start mongodb-community
    else
        sudo systemctl start mongodb
    fi
fi
echo ""

echo "[2/4] Starting Backend Server..."
cd backend
npm start &
BACKEND_PID=$!
sleep 3
echo ""

echo "[3/4] Starting Frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!
echo ""

echo "[4/4] Done!"
echo ""
echo "========================================"
echo "Applications Started:"
echo "========================================"
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "Field Manager: http://localhost:5173/field-manager"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
