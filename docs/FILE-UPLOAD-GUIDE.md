# File Upload Feature Guide

## Overview
Field Manager now supports file uploads for `uploadFile` action type fields. Files are stored in `backend/test-files/` and automatically used during test execution.

## How to Use

### 1. Add New Field with File Upload

1. Open Field Manager: http://localhost:5173/field-manager
2. Click "+ Add New Field"
3. Configure:
   - **Field Name**: `docUpload`
   - **Label**: `Document Upload`
   - **Section**: `Documents`
   - **Action Type**: `uploadFile`
   - **Selector**: `#fileInput` (your file input selector)
   - **Default Value**: Click "Choose File" and select your PDF/image
4. Click "Save"

### 2. Edit Existing Field to Upload File

1. Find the field in Field Manager
2. Click "Edit"
3. In "Default Value" section, click "Choose File"
4. Select your file (PDF or image)
5. Click "Update"

### 3. Test Generator Integration

1. Open Test Generator: http://localhost:5173/generator
2. Enable "Use Dynamic Fields"
3. Fields with `uploadFile` action will show the uploaded filename
4. Run tests - files will be automatically resolved from `backend/test-files/`

## File Storage

- **Location**: `backend/test-files/`
- **Supported Formats**: 
  - Images: `.png`, `.jpg`, `.jpeg`, `.gif`
  - Documents: `.pdf`, `.doc`, `.docx`
- **File Resolution**: 
  - Relative paths (e.g., `document.pdf`) → `backend/test-files/document.pdf`
  - Absolute paths remain unchanged

## Backend Processing

The backend automatically:
1. Receives uploaded files via multipart/form-data
2. Saves files to `test-files/` directory
3. Stores filename in database (`uploadedFileName` field)
4. Resolves file paths during test execution
5. Passes absolute paths to Playwright's `setInputFiles()`

## Example Workflow

```javascript
// 1. User uploads "id-proof.pdf" in Field Manager
// 2. Backend saves to: backend/test-files/id-proof.pdf
// 3. Database stores: { defaultValue: "id-proof.pdf", uploadedFileName: "id-proof.pdf" }
// 4. During test execution:
//    - Backend resolves: "id-proof.pdf" → "C:/path/to/backend/test-files/id-proof.pdf"
//    - Playwright uploads the file
```

## Troubleshooting

### Error: "ENOENT: no such file or directory"
- **Cause**: File doesn't exist in `test-files/` directory
- **Solution**: 
  1. Check if file exists in `backend/test-files/`
  2. Re-upload file via Field Manager
  3. Ensure filename matches exactly (case-sensitive)

### File Not Uploading in Tests
- **Cause**: Incorrect selector or file path
- **Solution**:
  1. Verify selector in Field Manager
  2. Check file exists in `test-files/`
  3. Review backend logs for path resolution

## API Changes

### POST /api/v1/field-configs
- Now accepts `multipart/form-data`
- File field name: `file`
- Other fields: standard form fields

### PUT /api/v1/field-configs/:id
- Now accepts `multipart/form-data`
- File field name: `file`
- Updates `uploadedFileName` and `defaultValue` if file provided

## Database Schema

```javascript
{
  fieldName: "docUpload",
  actionType: "uploadFile",
  defaultValue: "document.pdf",        // Filename to use
  uploadedFileName: "document.pdf",    // Original uploaded filename
  // ... other fields
}
```
