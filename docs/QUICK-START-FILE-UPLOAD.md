# Quick Start: File Upload Feature

## Problem Solved
❌ **Before**: `ENOENT: no such file or directory` errors when running tests with file uploads

✅ **After**: Upload files via UI, automatically used in tests

## 3-Step Setup

### Step 1: Place Your Test File
Copy your test file to the backend directory:
```bash
# Windows
copy "Screenshot (1).png" "backend\test-files\"

# Mac/Linux
cp "Screenshot (1).png" backend/test-files/
```

### Step 2: Update Field in Field Manager
1. Open http://localhost:5173/field-manager
2. Find "Document Upload File" field
3. Click "Edit"
4. In "Default Value" section, click "Choose File"
5. Select your file (e.g., Screenshot (1).png)
6. Click "Update"

### Step 3: Run Your Test
1. Open http://localhost:5173/generator
2. Enable "Use Dynamic Fields"
3. Add test case
4. Click "Run Tests"
5. ✅ File uploads successfully!

## Alternative: Upload Directly in Field Manager

Instead of Step 1, you can upload directly:
1. Field Manager → Edit field
2. Choose file from your computer
3. File automatically copied to `backend/test-files/`
4. Ready to use in tests!

## Supported File Types
- Images: `.png`, `.jpg`, `.jpeg`, `.gif`
- Documents: `.pdf`, `.doc`, `.docx`

## Troubleshooting

### Still getting ENOENT error?
1. Check file exists: `dir backend\test-files` (Windows) or `ls backend/test-files` (Mac/Linux)
2. Verify filename matches exactly (case-sensitive)
3. Re-upload file via Field Manager

### File not uploading?
1. Restart backend: `cd backend && npm start`
2. Check browser console for errors
3. Verify file size is reasonable (< 10MB)

## Example: Adding New Upload Field

```javascript
// Field Configuration
Field Name: myDocUpload
Label: My Document Upload
Section: Documents
Action Type: uploadFile
Selector: #fileInput
Default Value: [Click "Choose File" and select]
```

That's it! Your file upload is ready to use in automated tests.
