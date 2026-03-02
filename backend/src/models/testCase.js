import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    appUrl: { type: String, required: true },
    insuranceInput: { type: mongoose.Schema.Types.Mixed, default: null },
    steps: { type: [mongoose.Schema.Types.Mixed], required: true, default: [] },
    createdBy: { type: String, default: null }
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: false }
  }
);

testCaseSchema.index({ tenantId: 1, createdAt: -1 });

export const TestCase = mongoose.model("TestCase", testCaseSchema);

