import { useState, useEffect } from "react";
import { getFieldConfigs, createFieldConfig, updateFieldConfig, deleteFieldConfig, reorderFieldConfigs } from "../services/api";
import "./FieldManagerPage.css";

interface FieldConfig {
  id: string;
  fieldName: string;
  label: string;
  section: string;
  actionType: string;
  selector: string;
  inputType: string;
  selectOptions: string[];
  defaultValue: string;
  order: number;
  isRequired: boolean;
}

export default function FieldManagerPage() {
  const [fields, setFields] = useState<FieldConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<FieldConfig | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    loadFields();
  }, []);

  async function loadFields() {
    try {
      console.log("Loading fields...");
      const data = await getFieldConfigs();
      console.log("Fields loaded:", data);
      setFields(data);
    } catch (err: any) {
      console.error("Error loading fields:", err);
      alert("Failed to load fields: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function openModal(field?: FieldConfig) {
    if (field) {
      setEditingField({ ...field });
    } else {
      setEditingField({
        id: "",
        fieldName: "",
        label: "",
        section: "Personal Information",
        actionType: "fill",
        selector: "",
        inputType: "text",
        selectOptions: [],
        defaultValue: "",
        order: fields.length,
        isRequired: false
      });
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingField(null);
  }

  async function saveField() {
    if (!editingField) return;

    try {
      console.log("Saving field:", editingField);
      if (editingField.id) {
        const result = await updateFieldConfig(editingField.id, editingField);
        console.log("Update result:", result);
      } else {
        const result = await createFieldConfig(editingField);
        console.log("Create result:", result);
      }
      await loadFields();
      closeModal();
      alert("Field saved successfully!");
    } catch (err: any) {
      console.error("Save error:", err);
      alert("Failed to save field: " + err.message);
    }
  }

  async function removeField(id: string) {
    if (!confirm("Delete this field?")) return;
    try {
      await deleteFieldConfig(id);
      await loadFields();
    } catch (err: any) {
      alert("Failed to delete field: " + err.message);
    }
  }

  function handleDragStart(index: number) {
    setDraggedIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newFields = [...fields];
    const draggedItem = newFields[draggedIndex];
    newFields.splice(draggedIndex, 1);
    newFields.splice(index, 0, draggedItem);

    setFields(newFields);
    setDraggedIndex(index);
  }

  async function handleDragEnd() {
    if (draggedIndex === null) return;
    try {
      const fieldIds = fields.map(f => f.id);
      await reorderFieldConfigs(fieldIds);
      setDraggedIndex(null);
    } catch (err: any) {
      alert("Failed to reorder: " + err.message);
      await loadFields();
    }
  }

  const sections = [...new Set(fields.map(f => f.section))];

  if (loading) return <div className="field-manager">Loading...</div>;

  if (fields.length === 0) {
    return (
      <div className="field-manager">
        <div className="header">
          <h1>Field Configuration Manager</h1>
          <button onClick={() => openModal()} className="btn-primary">+ Add New Field</button>
        </div>
        <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
          <p>No fields found. Click "+ Add New Field" to create your first field.</p>
          <p style={{ fontSize: "14px", marginTop: "16px" }}>Or run: <code>cd backend && npm run seed:fields</code></p>
        </div>
      </div>
    );
  }

  return (
    <div className="field-manager">
      <div className="header">
        <h1>Field Configuration Manager</h1>
        <button onClick={() => openModal()} className="btn-primary">+ Add New Field</button>
      </div>

      <div className="sections-container">
        {sections.map(section => (
          <div key={section} className="section-group">
            <h2>{section}</h2>
            <div className="fields-list">
              {fields.filter(f => f.section === section).map((field, idx) => {
                const globalIdx = fields.indexOf(field);
                return (
                  <div
                    key={field.id}
                    className="field-item"
                    draggable
                    onDragStart={() => handleDragStart(globalIdx)}
                    onDragOver={(e) => handleDragOver(e, globalIdx)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="drag-handle">⋮⋮</div>
                    <div className="field-info">
                      <div className="field-name">{field.label}</div>
                      <div className="field-meta">
                        <span className="badge">{field.actionType}</span>
                        <span className="field-key">{field.fieldName}</span>
                        {field.inputType !== "text" && <span className="badge-secondary">{field.inputType}</span>}
                      </div>
                      {field.selector && <div className="field-selector">{field.selector}</div>}
                    </div>
                    <div className="field-actions">
                      <button onClick={() => openModal(field)} className="btn-edit">Edit</button>
                      <button onClick={() => removeField(field.id)} className="btn-delete">Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showModal && editingField && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingField.id ? "Edit Field" : "Add New Field"}</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Field Name (key)</label>
                <input
                  value={editingField.fieldName}
                  onChange={(e) => setEditingField({ ...editingField, fieldName: e.target.value })}
                  placeholder="e.g., firstName"
                />
              </div>

              <div className="form-group">
                <label>Label</label>
                <input
                  value={editingField.label}
                  onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                  placeholder="e.g., First Name"
                />
              </div>

              <div className="form-group">
                <label>Section</label>
                <input
                  value={editingField.section}
                  onChange={(e) => setEditingField({ ...editingField, section: e.target.value })}
                  placeholder="e.g., Personal Information"
                />
              </div>

              <div className="form-group">
                <label>Action Type</label>
                <select
                  value={editingField.actionType}
                  onChange={(e) => setEditingField({ ...editingField, actionType: e.target.value })}
                >
                  <option value="fill">Fill</option>
                  <option value="click">Click</option>
                  <option value="select">Select</option>
                  <option value="check">Check</option>
                  <option value="press">Press</option>
                  <option value="wait">Wait</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Selector</label>
                <input
                  value={editingField.selector}
                  onChange={(e) => setEditingField({ ...editingField, selector: e.target.value })}
                  placeholder="e.g., role=textbox[name='First Name']"
                />
              </div>

              <div className="form-group">
                <label>Input Type</label>
                <select
                  value={editingField.inputType}
                  onChange={(e) => setEditingField({ ...editingField, inputType: e.target.value })}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="select">Select</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="date">Date</option>
                </select>
              </div>

              <div className="form-group">
                <label>Default Value</label>
                <input
                  value={editingField.defaultValue}
                  onChange={(e) => setEditingField({ ...editingField, defaultValue: e.target.value })}
                  placeholder="Default value"
                />
              </div>

              {editingField.inputType === "select" && (
                <div className="form-group full-width">
                  <label>Select Options (comma-separated)</label>
                  <input
                    value={editingField.selectOptions.join(",")}
                    onChange={(e) => setEditingField({ ...editingField, selectOptions: e.target.value.split(",").map(s => s.trim()) })}
                    placeholder="Option1,Option2,Option3"
                  />
                </div>
              )}

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={editingField.isRequired}
                    onChange={(e) => setEditingField({ ...editingField, isRequired: e.target.checked })}
                  />
                  Required Field
                </label>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={closeModal} className="btn-secondary">Cancel</button>
              <button onClick={saveField} className="btn-primary">{editingField.id ? "Update" : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
