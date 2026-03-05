# 🚀 Quick Start Guide (Node.js)

## Prerequisites
- ✅ Node.js 18+ installed
- ✅ MongoDB installed and running
- ✅ npm or yarn

## One-Time Setup

### 1. Install MongoDB (if not installed)

**Windows:**
- Download from: https://www.mongodb.com/try/download/community
- Install and start service:
```bash
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

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

### 3. Seed Initial Data

```bash
cd backend
npm run seed:fields
```

## Start Application

### Option 1: Use Startup Script (Recommended)

**Windows:**
```bash
start.bat
```

**macOS/Linux:**
```bash
chmod +x start.sh
./start.sh
```

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Access Applications

- 🌐 **Frontend**: http://localhost:5173
- 🔧 **Backend API**: http://localhost:8000
- ⚙️ **Field Manager**: http://localhost:5173/field-manager
- 📝 **Test Generator**: http://localhost:5173/generator

## Verify Setup

```bash
# Check backend health
curl http://localhost:8000/api/v1/health

# Check field configs
curl http://localhost:8000/api/v1/field-configs?tenantId=00000000-0000-0000-0000-000000000001
```

## Development Commands

```bash
# Backend with auto-reload
cd backend
npm run dev

# Frontend with hot reload
cd frontend
npm run dev

# Re-seed fields
cd backend
npm run seed:fields
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
# Windows - Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

### Clear and Re-seed Data
```bash
# Connect to MongoDB
mongosh

# Drop collections
use insurance-test-copilot
db.fieldconfigs.drop()

# Exit and re-seed
exit
cd backend
npm run seed:fields
```

## Next Steps

1. ✅ Open Field Manager: http://localhost:5173/field-manager
2. ✅ Add/Edit/Reorder fields
3. ✅ Open Test Generator: http://localhost:5173/generator
4. ✅ Enable "Use Dynamic Fields"
5. ✅ Create and run test cases

## Documentation

- 📖 **Complete Guide**: `docs/dynamic-fields-guide.md`
- 📖 **Setup Details**: `SETUP-NODEJS.md`
- 📖 **Feature Overview**: `DYNAMIC-FIELDS-COMPLETE.md`

## Support

For issues or questions, check the documentation files in the `docs/` folder.
