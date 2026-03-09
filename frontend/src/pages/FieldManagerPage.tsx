import { useState, useEffect } from "react";
import { getFieldConfigs, createFieldConfig, updateFieldConfig, deleteFieldConfig, reorderFieldConfigs } from "../services/api";
import "./FieldManagerPage.css";

const DEMO_TENANT_ID = "00000000-0000-0000-0000-000000000001";

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
  isSkipped: boolean;
  captureAs: string;
  conditions: { ref: string; equals: string }[];
}

export default function FieldManagerPage({ tenantId }: { tenantId?: string }) {
  const activeTenantId = tenantId || DEMO_TENANT_ID;
  const [fields, setFields] = useState<FieldConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<FieldConfig | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  function toggleSection(section: string) {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(section) ? next.delete(section) : next.add(section);
      return next;
    });
  }

  useEffect(() => {
    loadFields();
  }, [activeTenantId]);

  async function loadFields() {
    try {
      const data = await getFieldConfigs(activeTenantId);
      setFields(data);
      setExpandedSections(new Set<string>(data.map((f: any) => f.section)));
      setError(null);
    } catch (err: any) {
      setError("Failed to load fields: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function openModal(field?: FieldConfig) {
    if (field) {
      setEditingField({
        ...field,
        selectOptions: field.selectOptions ?? [],
        isSkipped: field.isSkipped ?? false,
        captureAs: field.captureAs ?? "",
        conditions: field.conditions ?? []
      });
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
        isRequired: false,
        isSkipped: false,
        captureAs: "",
        conditions: []
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
        const result = await createFieldConfig({ ...editingField, tenantId: activeTenantId });
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

  if (error) {
    return (
      <div className="field-manager">
        <div className="header">
          <h1>Field Configuration Manager</h1>
          <button onClick={loadFields} className="btn-primary">Retry</button>
        </div>
        <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>
          <p>{error}</p>
          <p style={{ fontSize: "14px", marginTop: "8px", color: "#6b7280" }}>Make sure the backend is running on port 8000</p>
        </div>
      </div>
    );
  }

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
            <h2 className="section-header" onClick={() => toggleSection(section)} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {section}
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {expandedSections.has(section) && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); setExpandedSections(new Set(sections)); }} className="btn-secondary" style={{ padding: "2px 8px", fontSize: "11px" }}>Expand All</button>
                    <button onClick={(e) => { e.stopPropagation(); setExpandedSections(new Set()); }} className="btn-secondary" style={{ padding: "2px 8px", fontSize: "11px" }}>Collapse All</button>
                  </>
                )}
                <span style={{ fontSize: "12px", color: "#6b7280" }}>{expandedSections.has(section) ? "▼" : "▶"} {fields.filter(f => f.section === section).length} fields</span>
              </span>
            </h2>
            {expandedSections.has(section) && <div className="fields-list">
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
                        {field.isSkipped && <span className="badge-skipped">⏭ Skipped</span>}
                        {field.captureAs && <span className="badge-capture">📌 {field.captureAs}</span>}
                        {field.conditions?.length > 0 && <span className="badge-condition">🔀 {field.conditions.length} condition(s)</span>}
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
            </div>}
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
                <select
                  value={editingField.section}
                  onChange={(e) => setEditingField({ ...editingField, section: e.target.value })}
                >
                  {sections.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
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
                  <option value="uploadFile">Upload File</option>
                  <option value="goto">Goto</option>
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

              {/* Skip Toggle */}
              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>Skip this step</span>
                  <div
                    onClick={() => setEditingField({ ...editingField, isSkipped: !editingField.isSkipped })}
                    style={{
                      width: "44px", height: "24px", borderRadius: "12px", cursor: "pointer",
                      background: editingField.isSkipped ? "#ef4444" : "#d1d5db",
                      position: "relative", transition: "background 0.2s"
                    }}
                  >
                    <div style={{
                      width: "18px", height: "18px", borderRadius: "50%", background: "white",
                      position: "absolute", top: "3px",
                      left: editingField.isSkipped ? "23px" : "3px",
                      transition: "left 0.2s"
                    }} />
                  </div>
                  {editingField.isSkipped && <span style={{ color: "#ef4444", fontSize: "12px" }}>Field will be skipped during test</span>}
                </label>
              </div>

              {/* Capture As */}
              <div className="form-group">
                <label>Save answer as context variable (optional)</label>
                <input
                  value={editingField.captureAs}
                  onChange={(e) => setEditingField({ ...editingField, captureAs: e.target.value })}
                  placeholder="e.g., isSmoker"
                />
                <small style={{ color: "#6b7280" }}>Other fields can depend on this value</small>
              </div>

              {/* Conditions */}
              <div className="form-group full-width">
                <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span>Has conditions (show only if)</span>
                  <div
                    onClick={() => {
                      if (editingField.conditions.length === 0) {
                        setEditingField({ ...editingField, conditions: [{ ref: "", equals: "" }] });
                      } else {
                        setEditingField({ ...editingField, conditions: [] });
                      }
                    }}
                    style={{
                      width: "44px", height: "24px", borderRadius: "12px", cursor: "pointer",
                      background: editingField.conditions.length > 0 ? "#2563eb" : "#d1d5db",
                      position: "relative", transition: "background 0.2s"
                    }}
                  >
                    <div style={{
                      width: "18px", height: "18px", borderRadius: "50%", background: "white",
                      position: "absolute", top: "3px",
                      left: editingField.conditions.length > 0 ? "23px" : "3px",
                      transition: "left 0.2s"
                    }} />
                  </div>
                </label>

                {editingField.conditions.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {editingField.conditions.map((cond, ci) => (
                      <div key={ci} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ fontSize: "13px", color: "#6b7280", minWidth: "30px" }}>{ci === 0 ? "IF" : "AND"}</span>
                        <select
                          value={cond.ref}
                          onChange={(e) => {
                            const updated = [...editingField.conditions];
                            updated[ci] = { ...updated[ci], ref: e.target.value };
                            setEditingField({ ...editingField, conditions: updated });
                          }}
                          style={{ flex: 1, padding: "6px", border: "1px solid #d1d5db", borderRadius: "4px" }}
                        >
                          <option value="">Select field...</option>
                          {fields.map(f => (
                            <option key={f.id} value={f.fieldName}>{f.label} ({f.fieldName})</option>
                          ))}
                        </select>
                        <span style={{ fontSize: "13px", color: "#6b7280" }}>equals</span>
                        <input
                          value={cond.equals}
                          onChange={(e) => {
                            const updated = [...editingField.conditions];
                            updated[ci] = { ...updated[ci], equals: e.target.value };
                            setEditingField({ ...editingField, conditions: updated });
                          }}
                          placeholder="value"
                          style={{ width: "100px", padding: "6px", border: "1px solid #d1d5db", borderRadius: "4px" }}
                        />
                        <button
                          type="button"
                          onClick={() => setEditingField({ ...editingField, conditions: editingField.conditions.filter((_, i) => i !== ci) })}
                          style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "16px" }}
                        >✕</button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setEditingField({ ...editingField, conditions: [...editingField.conditions, { ref: "", equals: "" }] })}
                      style={{ alignSelf: "flex-start", background: "none", border: "1px dashed #2563eb", color: "#2563eb", padding: "4px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}
                    >+ Add condition</button>
                  </div>
                )}
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
