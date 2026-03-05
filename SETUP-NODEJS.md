# Setup Instructions (Node.js - No Docker)

## Prerequisites
- Node.js 18+ installed
- MongoDB installed and running locally
- Git

## Installation Steps

### 1. Install MongoDB (if not installed)

**Windows:**
```bash
# Download from https://www.mongodb.com/try/download/community
# Install and start MongoDB service
net start MongoDB
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 2. Clone and Setup Backend

```bash
cd "c:\PLIL\Automate Tool\backend"
npm install
```

### 3. Setup Frontend

```bash
cd "c:\PLIL\Automate Tool\frontend"
npm install
```

### 4. Configure Environment

Create `.env` file in backend folder:
```bash
cd "c:\PLIL\Automate Tool\backend"
echo MONGODB_URI=mongodb://localhost:27017/insurance-test-copilot > .env
echo PORT=8000 >> .env
```

### 5. Seed Initial Field Configurations

```bash
cd "c:\PLIL\Automate Tool\backend"
npm run seed:fields
```

### 6. Start Backend Server

```bash
cd "c:\PLIL\Automate Tool\backend"
npm start
```

Backend will run on: http://localhost:8000

### 7. Start Frontend (New Terminal)

```bash
cd "c:\PLIL\Automate Tool\frontend"
npm run dev
```

Frontend will run on: http://localhost:5173

## Access Applications

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Field Manager**: http://localhost:5173/field-manager
- **Test Generator**: http://localhost:5173/generator
- **MongoDB**: mongodb://localhost:27017

## Verify Installation

### Check Backend
```bash
curl http://localhost:8000/api/v1/health
```

### Check Field Configs
```bash
curl http://localhost:8000/api/v1/field-configs?tenantId=00000000-0000-0000-0000-000000000001
```

## Development Mode

### Backend with Auto-Reload
```bash
cd "c:\PLIL\Automate Tool\backend"
npm run dev
```

### Frontend with Hot Reload
```bash
cd "c:\PLIL\Automate Tool\frontend"
npm run dev
```

## Troubleshooting

### MongoDB Not Running
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb
```

### Port Already in Use
```bash
# Kill process on port 8000
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

### Clear MongoDB Data
```bash
# Connect to MongoDB
mongosh

# Use database
use insurance-test-copilot

# Drop collections
db.fieldconfigs.drop()
db.testcases.drop()

# Re-seed
cd backend
npm run seed:fields
```

## Quick Start Commands

### Start Everything
```bash
# Terminal 1 - Backend
cd "c:\PLIL\Automate Tool\backend" && npm start

# Terminal 2 - Frontend
cd "c:\PLIL\Automate Tool\frontend" && npm run dev
```

### Stop Everything
```bash
# Press Ctrl+C in both terminals
```

## Production Build

### Build Frontend
```bash
cd "c:\PLIL\Automate Tool\frontend"
npm run build
```

### Serve Production Build
```bash
npm run preview
```
