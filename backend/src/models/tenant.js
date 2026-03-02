import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true }
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export const Tenant = mongoose.model("Tenant", tenantSchema);

