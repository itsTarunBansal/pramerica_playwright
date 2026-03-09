import mongoose from "mongoose";

const fieldConfigSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    tenantId: { type: String, required: true, index: true },
    fieldName: { type: String, required: true },
    label: { type: String, required: true },
    section: { type: String, required: true },
    actionType: { type: String, enum: ["fill", "click", "select", "check", "press", "wait", "uploadFile", "goto"], required: true },
    selector: { type: String, default: "" },
    inputType: { type: String, enum: ["text", "number", "select", "checkbox", "date"], default: "text" },
    selectOptions: { type: [String], default: [] },
    defaultValue: { type: String, default: "" },
    order: { type: Number, required: true },
    isRequired: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isSkipped: { type: Boolean, default: false },
    captureAs: { type: String, default: "" },
    conditions: { type: [{ ref: String, equals: String }], default: [] },
    isSkipped: { type: Boolean, default: false },
    captureAs: { type: String, default: "" },
    conditions: {
      type: [{
        ref: { type: String, required: true },
        equals: { type: String, required: true }
      }],
      default: []
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

fieldConfigSchema.index({ tenantId: 1, order: 1 });
fieldConfigSchema.index({ tenantId: 1, fieldName: 1 }, { unique: true });

export const FieldConfig = mongoose.model("FieldConfig", fieldConfigSchema);
