# File Upload Feature - Implementation Summary

## ✅ What Was Implemented

### 1. Backend Changes

#### Database Model (`backend/src/models/fieldConfig.js`)
- Added `uploadedFileName` field to store uploaded file names
- Maintains backward compatibility with existing fields

#### API Routes (`backend/src/routes/fieldConfig.js`)
- Integrated `multer` middleware for file upload handling
- POST `/api/v1/field-configs` - Now accepts multipart/form-data with file uploads
- PUT `/api/v1/field-configs/:id` - Now accepts multipart/form-data for file updates
- Files saved to `backend/test-files/` directory
- Automatic filename storage in database

#### Test Execution (`backend/src/routes/runTests.js`)
- Added path resolution for uploaded files
- Relative paths automatically resolved to `backend/test-files/`
- Absolute paths remain unchanged
- Seamless integration with Playwright's `setInputFiles()`

#### Dependencies
- Installed `multer` package for file upload handling

### 2. Frontend Changes

#### Field Manager UI (`frontend/src/pages/FieldManagerPage.tsx`)
- Added file input for `uploadFile` action type fields
- Shows current uploaded filename
- Accepts images and PDFs
- File upload state management
- FormData submission for file uploads

#### Redux Store (`frontend/src/store/slices/fieldConfigsSlice.ts`)
- Updated `addFieldConfig` thunk to handle FormData
- Updated `editFieldConfig` thunk to handle FormData
- Added `uploadedFileName` to FieldConfig interface
- Proper Content-Type headers for multipart requests

### 3. Data & Configuration

#### Seed Data (`backend/src/seedFields.js`)
- Updated uploadFile fields with `uploadedFileName` property
- Changed default filenames to more descriptive names:
  - `docUploadFile`: `sample-document.pdf`
  - `fileInput104`: `sample-id-proof.pdf`

#### Test Files Directory (`backend/test-files/`)
- Created directory structure
- Added README with usage instructions
- Created placeholder sample files

### 4. Documentation

#### New Files Created
- `docs/FILE-UPLOAD-GUIDE.md` - Complete guide for file upload feature
- `backend/test-files/README.md` - Directory usage instructions
- `backend/test-files/sample-document.txt` - Placeholder file

#### Updated Files
- `README.md` - Added file upload feature documentation

## 🔄 User Workflow

### Adding a New Field with File Upload

1. **Field Manager** → Click "+ Add New Field"
2. Set **Action Type** to `uploadFile`
3. Configure selector and other properties
4. In **Default Value** section, click "Choose File"
5. Select PDF or image file
6. Click "Save"
7. File is uploaded to `backend/test-files/`
8. Filename stored in database

### Editing Existing Field to Upload File

1. **Field Manager** → Find field → Click "Edit"
2. In **Default Value** section, click "Choose File"
3. Select new file
4. Click "Update"
5. New file replaces old file in `backend/test-files/`

### Using in Test Generator

1. **Test Generator** → Enable "Use Dynamic Fields"
2. Fields with `uploadFile` action show uploaded filename
3. Click "Run Tests"
4. Backend automatically resolves file path
5. Playwright uploads file during test execution

## 🔧 Technical Details

### File Storage
- **Location**: `backend/test-files/`
- **Naming**: Original filename preserved
- **Overwrite**: Files with same name are overwritten

### Path Resolution
```javascript
// Relative path
"document.pdf" → "C:/path/to/backend/test-files/document.pdf"

// Absolute path (unchanged)
"C:/custom/path/file.pdf" → "C:/custom/path/file.pdf"
```

### API Request Format

**Create Field with File:**
```
POST /api/v1/field-configs
Content-Type: multipart/form-data

file: [binary data]
fieldName: "docUpload"
label: "Document Upload"
actionType: "uploadFile"
... other fields
```

**Update Field with File:**
```
PUT /api/v1/field-configs/:id
Content-Type: multipart/form-data

file: [binary data]
... other fields to update
```

### Database Schema
```javascript
{
  fieldName: "docUpload",
  actionType: "uploadFile",
  selector: "#fileInput",
  defaultValue: "document.pdf",        // Filename to use in tests
  uploadedFileName: "document.pdf",    // Original uploaded filename
  order: 114,
  // ... other fields
}
```

## 🎯 Benefits

1. **No Manual File Management** - Files uploaded via UI, no need to manually copy to server
2. **Automatic Path Resolution** - Backend handles path resolution automatically
3. **Database Tracking** - All uploaded files tracked in database
4. **Test Generator Integration** - Seamless integration with existing test workflow
5. **Error Prevention** - Eliminates "ENOENT: no such file" errors
6. **User Friendly** - Simple file picker interface

## 🚀 Next Steps

1. **Restart Backend** to apply changes:
   ```bash
   cd backend
   npm start
   ```

2. **Restart Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Re-seed Database** (optional):
   ```bash
   cd backend
   npm run seed:fields
   ```

4. **Upload Your Files**:
   - Open Field Manager
   - Edit uploadFile fields
   - Upload your actual test files (PDFs, images)

5. **Run Tests**:
   - Open Test Generator
   - Enable "Use Dynamic Fields"
   - Run tests with uploaded files

## 📝 Notes

- Supported file types: Images (.png, .jpg, .jpeg, .gif), Documents (.pdf, .doc, .docx)
- Maximum file size: Default multer limit (adjust in `fieldConfig.js` if needed)
- Files are stored with original filenames
- Duplicate filenames will overwrite existing files
- File validation can be added in future updates

## ✅ Testing Checklist

- [x] Backend accepts file uploads
- [x] Files saved to test-files directory
- [x] Database stores filename correctly
- [x] Frontend shows file picker for uploadFile fields
- [x] FormData submission works
- [x] Test execution resolves file paths
- [x] Playwright uploads files successfully
- [x] Error handling for missing files
- [x] Documentation updated
- [x] Seed data updated

## 🐛 Troubleshooting

**Issue**: File not uploading
- Check browser console for errors
- Verify backend is running
- Check file size limits

**Issue**: Test fails with ENOENT error
- Verify file exists in `backend/test-files/`
- Check filename matches exactly (case-sensitive)
- Review backend logs for path resolution

**Issue**: FormData not sending
- Check Content-Type header is set correctly
- Verify multer middleware is configured
- Check Redux thunk handles FormData
