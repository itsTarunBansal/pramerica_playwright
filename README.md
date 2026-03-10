# AI Insurance Test Copilot - Dynamic Field System

Complete test automation platform with dynamic field management.

## ✨ Features

- 🎯 **Dynamic Field Manager** - Add/Edit/Delete fields without code
- 📤 **File Upload Support** - Upload files (PDF/images) for test automation
- 🔄 **Drag & Drop** - Reorder fields visually
- 🎨 **Modern UI** - Card-based, responsive design
- 🤖 **Playwright Integration** - Auto-generate test steps
- 💾 **MongoDB Storage** - Persistent configurations
- 🚀 **REST API** - Full CRUD operations

## Prerequisites

- Node.js 18+
- MongoDB (local or remote)
- npm or yarn

## Quick Start

### 1. Install MongoDB

**Windows:**
```bash
net start MongoDB
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongodb
```

### 2. Install & Start

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Seed initial fields
cd backend && npm run seed:fields

# Start backend (Terminal 1)
cd backend && npm start

# Start frontend (Terminal 2)
cd frontend && npm run dev
```

### 3. Access Applications

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Field Manager: http://localhost:5173/field-manager
- Test Generator: http://localhost:5173/generator

## Project Structure

```text
backend/
  src/
    models/
      fieldConfig.js       # Field configuration model
      testCase.js
      execution.js
    routes/
      fieldConfig.js       # Field CRUD API (with file upload)
      testCases.js
      runTests.js
    seedFields.js          # Initial data seeder
  test-files/              # Uploaded test files storage
    
frontend/
  src/
    pages/
      FieldManagerPage.tsx # Field management UI
      TestCaseGeneratorPage.tsx # Test generator
    services/
      api.ts               # API client
      dynamicSteps.ts      # Dynamic step builder
```

## Usage

### Managing Fields

1. Open Field Manager: http://localhost:5173/field-manager
2. Click "+ Add New Field"
3. Configure:
   - Field Name: `customerAge`
   - Label: `Customer Age`
   - Section: `Personal Information`
   - Action Type: `fill`
   - Selector: `role=textbox[name='Age']`
4. Save and use in Test Generator

### Uploading Files for Tests

1. Open Field Manager
2. Create/Edit a field with Action Type: `uploadFile`
3. In "Default Value", click "Choose File"
4. Select your PDF or image file
5. Save - file is stored in `backend/test-files/`
6. Tests will automatically use the uploaded file

### Creating Tests

1. Open Test Generator: http://localhost:5173/generator
2. Enable "Use Dynamic Fields"
3. Add test cases
4. Fill in fields
5. Run tests

## Documentation

- 📖 [Quick Start Guide](START-HERE.md)
- 📖 [Setup Instructions](SETUP-NODEJS.md)
- 📖 [File Upload Guide](docs/FILE-UPLOAD-GUIDE.md)
- 📖 [Complete Feature Guide](docs/dynamic-fields-guide.md)
- 📖 [Implementation Details](DYNAMIC-FIELDS-COMPLETE.md)

## Development

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

## API Endpoints

```
GET    /api/v1/field-configs              # List fields
POST   /api/v1/field-configs              # Create field
PUT    /api/v1/field-configs/:id          # Update field
DELETE /api/v1/field-configs/:id          # Delete field
POST   /api/v1/field-configs/reorder      # Reorder fields
```

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose, Playwright
- **Frontend**: React, TypeScript, Vite
- **Database**: MongoDB
- **Testing**: Playwright

## Notes

- Backend connects to MongoDB on startup
- Field configurations are tenant-isolated
- Supports all Playwright action types including file uploads
- Dynamic form generation from database
- Uploaded files stored in `backend/test-files/`
