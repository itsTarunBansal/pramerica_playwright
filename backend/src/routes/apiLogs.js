import { Router } from "express";
import { ApiLog } from "../models/apiLog.js";

export const apiLogsRouter = Router();

// GET /api/v1/api-logs/:projectId — grouped by runId then testCaseId
// Optional: ?page=1&limit=50 for pagination
apiLogsRouter.get("/:projectId", async (req, res) => {
  try {
    const { page, limit } = req.query;
    const query = ApiLog.find({ projectId: req.params.projectId })
      .sort({ runId: -1, testCaseId: 1, startTime: 1 })
      .lean();
    if (page && limit) {
      query.skip((Number(page) - 1) * Number(limit)).limit(Number(limit));
    }
    const logs = await query;

    const runs = {};
    for (const log of logs) {
      if (!runs[log.runId]) runs[log.runId] = { runId: log.runId, testCases: {} };
      const tc = String(log.testCaseId);
      if (!runs[log.runId].testCases[tc]) runs[log.runId].testCases[tc] = [];
      runs[log.runId].testCases[tc].push(log);
    }

    const result = Object.values(runs).map(run => ({
      runId: run.runId,
      testCases: Object.entries(run.testCases).map(([tcId, tcLogs]) => ({
        testCaseId: tcId,
        logs: tcLogs,
      })),
    }));

    res.json(result);
  } catch (err) {
    console.error("[API Logs] GET failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/v1/api-logs/:projectId — delete all logs for project
apiLogsRouter.delete("/:projectId", async (req, res) => {
  await ApiLog.deleteMany({ projectId: req.params.projectId });
  res.json({ ok: true });
});

// DELETE /api/v1/api-logs/:projectId/run/:runId — delete one run
apiLogsRouter.delete("/:projectId/run/:runId", async (req, res) => {
  await ApiLog.deleteMany({ projectId: req.params.projectId, runId: req.params.runId });
  res.json({ ok: true });
});
