# Field Configuration Manager

## Overview
Dynamic field management system that allows you to add, edit, and reorder test case fields without modifying code.

## Features

### ✅ Implemented
- **Drag & Drop Reordering** - Reorder fields by dragging
- **CRUD Operations** - Create, Read, Update, Delete fields
- **Action Types** - Support for fill, click, select, check, press, wait
- **Input Types** - Text, number, select, checkbox, date
- **Selector Configuration** - Define Playwright selectors per field
- **Section Grouping** - Organize fields into logical sections
- **MongoDB Storage** - Persistent field configurations
- **REST API** - Full API for field management

## Usage

### 1. Access Field Manager
Navigate to: `http://localhost:5173/field-manager`

### 2. Add New Field
Click **"+ Add New Field"** button and fill:
- **Field Name**: Unique key (e.g., `firstName`)
- **Label**: Display name (e.g., `First Name`)
- **Section**: Group name (e.g., `Personal Information`)
- **Action Type**: Playwright action (fill/click/select/check/press/wait)
- **Selector**: Playwright selector (e.g., `role=textbox[name='First Name']`)
- **Input Type**: Form input type (text/number/select/checkbox/date)
- **Default Value**: Pre-filled value
- **Select Options**: For dropdown fields (comma-separated)

### 3. Edit Existing Field
Click **"Edit"** button on any field card to modify properties

### 4. Reorder Fields
Drag fields using the **⋮⋮** handle to change order

### 5. Delete Field
Click **"Delete"** button (soft delete - sets isActive=false)

## API Endpoints

### Get All Fields
```
GET /api/v1/field-configs?tenantId={tenantId}
```

### Create Field
```
POST /api/v1/field-configs
Body: {
  tenantId, fieldName, label, section, actionType,
  selector, inputType, selectOptions, defaultValue, order
}
```

### Update Field
```
PUT /api/v1/field-configs/:id
Body: { ...updates }
```

### Delete Field
```
DELETE /api/v1/field-configs/:id
```

### Reorder Fields
```
POST /api/v1/field-configs/reorder
Body: { fieldIds: ["id1", "id2", ...] }
```

## Database Schema

```javascript
{
  id: String (UUID),
  tenantId: String,
  fieldName: String,
  label: String,
  section: String,
  actionType: "fill" | "click" | "select" | "check" | "press" | "wait",
  selector: String,
  inputType: "text" | "number" | "select" | "checkbox" | "date",
  selectOptions: [String],
  defaultValue: String,
  order: Number,
  isRequired: Boolean,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Seed Initial Data

Run seed script to populate sample fields:
```bash
cd backend
node src/seedFields.js
```

## Integration with Test Generator

The Test Case Generator automatically loads field configurations from the database and renders forms dynamically based on the configured fields.

## Future Enhancements
- [ ] Conditional field visibility
- [ ] Field validation rules
- [ ] Custom field types
- [ ] Import/Export field configs
- [ ] Field templates
- [ ] Multi-step field dependencies
