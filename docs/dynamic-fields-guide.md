# Dynamic Field System - Complete Guide

## 🚀 Quick Start (Node.js)

### 1. Start MongoDB
```bash
# Windows
net start MongoDB

# macOS  
brew services start mongodb-community

# Linux
sudo systemctl start mongodb
```

### 2. Start Backend
```bash
cd "c:\PLIL\Automate Tool\backend"
npm install
npm run seed:fields
npm start
```

### 3. Start Frontend (New Terminal)
```bash
cd "c:\PLIL\Automate Tool\frontend"
npm install
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Field Manager: http://localhost:5173/field-manager

## 📋 Step-by-Step Tutorial

### Part 1: Managing Fields

#### Add a New Field
1. Navigate to **Field Manager** (http://localhost:5173/field-manager)
2. Click **"+ Add New Field"**
3. Fill in the form:
   ```
   Field Name: customerAge
   Label: Customer Age
   Section: Personal Information
   Action Type: fill
   Selector: role=textbox[name='Enter Age']
   Input Type: number
   Default Value: 30
   ```
4. Click **"Save"**

#### Edit an Existing Field
1. Find the field card in Field Manager
2. Click **"Edit"** button
3. Modify any property (e.g., change selector, label, or default value)
4. Click **"Save"**

#### Reorder Fields
1. Click and hold the **⋮⋮** drag handle
2. Drag the field to new position
3. Release to drop
4. Order is automatically saved

#### Delete a Field
1. Click **"Delete"** button on field card
2. Confirm deletion
3. Field is soft-deleted (isActive = false)

### Part 2: Using Dynamic Fields in Test Generator

#### Enable Dynamic Mode
1. Navigate to **Test Case Generator** (http://localhost:5173/generator)
2. Check the **"Use Dynamic Fields"** checkbox
3. Form will now render fields from database

#### Create Test Cases with Dynamic Fields
1. Click **"+ Add Test Cases"**
2. Expand a test case card
3. Fill in the dynamically generated fields
4. Fields are grouped by sections from Field Manager

#### Run Tests
1. Fill in test data
2. Click **"▶ Run Tests"**
3. System uses dynamic step builder if dynamic mode is enabled
4. Results downloaded as CSV

### Part 3: Field Configuration Examples

#### Example 1: Text Input Field
```json
{
  "fieldName": "customerName",
  "label": "Customer Name",
  "section": "Personal Information",
  "actionType": "fill",
  "selector": "role=textbox[name='Name']",
  "inputType": "text",
  "defaultValue": "John Doe"
}
```

#### Example 2: Dropdown/Select Field
```json
{
  "fieldName": "country",
  "label": "Country",
  "section": "Address",
  "actionType": "select",
  "selector": "#countryDropdown",
  "inputType": "select",
  "selectOptions": ["India", "USA", "UK", "Canada"],
  "defaultValue": "India"
}
```

#### Example 3: Checkbox Field
```json
{
  "fieldName": "agreeTerms",
  "label": "Agree to Terms",
  "section": "Consent",
  "actionType": "check",
  "selector": "#termsCheckbox",
  "inputType": "checkbox",
  "defaultValue": "true"
}
```

#### Example 4: Button Click
```json
{
  "fieldName": "submitButton",
  "label": "Submit Button",
  "section": "Actions",
  "actionType": "click",
  "selector": "role=button[name='Submit']",
  "inputType": "text",
  "defaultValue": ""
}
```

#### Example 5: Wait/Delay
```json
{
  "fieldName": "waitForLoad",
  "label": "Wait for Page Load",
  "section": "Actions",
  "actionType": "wait",
  "selector": "",
  "inputType": "number",
  "defaultValue": "3000"
}
```

## 🔄 Workflow

### Adding New Fields During Test Journey

**Scenario**: You discover a new field while testing

1. **Pause Testing**
2. **Open Field Manager** in new tab
3. **Add New Field**:
   - Field Name: `newDiscoveredField`
   - Label: `New Field Label`
   - Section: Choose appropriate section
   - Action Type: Based on element (fill/click/select)
   - Selector: Copy from browser DevTools
4. **Save Field**
5. **Return to Test Generator**
6. **Refresh** or toggle dynamic fields off/on
7. **New field appears** in the form

### Modifying Existing Field Selectors

**Scenario**: Website changed and selector broke

1. **Open Field Manager**
2. **Find the broken field**
3. **Click Edit**
4. **Update Selector** with new value
5. **Save**
6. **Tests now use new selector**

## 🎯 Best Practices

### Field Naming
- Use camelCase: `firstName`, `dateOfBirth`
- Be descriptive: `customerEmailAddress` not `email1`
- Avoid special characters

### Selectors
- Prefer role-based: `role=textbox[name='Email']`
- Use IDs when stable: `#emailInput`
- Avoid complex CSS selectors that break easily

### Sections
- Group logically: "Personal Information", "Address", "Financial"
- Keep consistent naming across fields
- Use title case

### Default Values
- Provide realistic test data
- Use valid formats (dates, emails, phone numbers)
- Consider data privacy (no real PII)

### Action Types
- **fill**: Text inputs, textareas
- **click**: Buttons, links, checkboxes (when not using check)
- **select**: Dropdowns, select elements
- **check**: Checkboxes, radio buttons
- **press**: Keyboard keys (Enter, Tab, Escape)
- **wait**: Delays between actions

## 🐛 Troubleshooting

### Fields Not Appearing
- Check "Use Dynamic Fields" is enabled
- Verify fields exist in database (Field Manager)
- Check browser console for errors
- Ensure backend is running

### Selector Not Working
- Test selector in browser DevTools
- Use Playwright Inspector to verify
- Check if element is in iframe
- Verify element is visible/enabled

### Order Not Saving
- Check network tab for API errors
- Verify MongoDB connection
- Check backend logs

## 📊 API Reference

### Get Fields
```bash
GET http://localhost:8000/api/v1/field-configs?tenantId=00000000-0000-0000-0000-000000000001
```

### Create Field
```bash
POST http://localhost:8000/api/v1/field-configs
Content-Type: application/json

{
  "tenantId": "00000000-0000-0000-0000-000000000001",
  "fieldName": "newField",
  "label": "New Field",
  "section": "Section Name",
  "actionType": "fill",
  "selector": "#selector",
  "inputType": "text",
  "defaultValue": "",
  "order": 100,
  "isRequired": false
}
```

### Update Field
```bash
PUT http://localhost:8000/api/v1/field-configs/{fieldId}
Content-Type: application/json

{
  "label": "Updated Label",
  "selector": "#newSelector"
}
```

### Delete Field
```bash
DELETE http://localhost:8000/api/v1/field-configs/{fieldId}
```

### Reorder Fields
```bash
POST http://localhost:8000/api/v1/field-configs/reorder
Content-Type: application/json

{
  "fieldIds": ["id1", "id2", "id3"]
}
```

## 🎓 Advanced Usage

### Conditional Fields
Currently not supported, but can be added by:
1. Adding `showWhen` property to field config
2. Implementing conditional rendering logic
3. Checking dependent field values

### Field Validation
Add validation by:
1. Adding `validation` property (regex, min, max)
2. Implementing validation in renderField
3. Showing error messages

### Custom Field Types
Extend by:
1. Adding new inputType values
2. Implementing custom renderers
3. Adding to renderField switch statement

## 📈 Monitoring

### Check Field Count
```bash
curl http://localhost:8000/api/v1/field-configs?tenantId=00000000-0000-0000-0000-000000000001 | jq 'length'
```

### View All Sections
```bash
curl http://localhost:8000/api/v1/field-configs?tenantId=00000000-0000-0000-0000-000000000001 | jq '[.[].section] | unique'
```

### Find Field by Name
```bash
curl http://localhost:8000/api/v1/field-configs?tenantId=00000000-0000-0000-0000-000000000001 | jq '.[] | select(.fieldName=="firstName")'
```
