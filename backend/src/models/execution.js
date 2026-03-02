import mongoose from "mongoose";

const executionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    tenantId: { type: String, required: true, index: true },
    testCaseId: { type: String, required: true, index: true },
    browser: { type: String, required: true },
    status: { type: String, required: true, default: "queued" },
    startedAt: { type: Date, default: Date.now },
    finishedAt: { type: Date, default: null },
    resultJson: { type: mongoose.Schema.Types.Mixed, default: null }
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: false }
  }
);

executionSchema.index({ tenantId: 1, createdAt: -1 });

export const Execution = mongoose.model("Execution", executionSchema);

