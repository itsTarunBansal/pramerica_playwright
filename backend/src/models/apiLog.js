import mongoose from "mongoose";

const apiLogSchema = new mongoose.Schema({
  projectId: { type: String, required: true, index: true },
  runId:     { type: String, required: true, index: true },
  testCaseId: { type: mongoose.Schema.Types.Mixed },
  pageUrl:    String,
  apiEndpoint: String,
  method:     String,
  statusCode: mongoose.Schema.Types.Mixed,
  startTime:  String,
  endTime:    String,
  responseTime: Number,
  requestPayload: String,
  responseBody: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now, expires: '7d' },
}, { timestamps: false });

// Compound index for fast dashboard queries
apiLogSchema.index({ projectId: 1, runId: 1, createdAt: -1 });

export const ApiLog = mongoose.model("ApiLog", apiLogSchema);
