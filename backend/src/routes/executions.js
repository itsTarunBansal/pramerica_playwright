import { Router } from "express";
import { validate as isUuid, v4 as uuidv4 } from "uuid";
import { Execution } from "../models/execution.js";
import { Tenant } from "../models/tenant.js";
import { TestCase } from "../models/testCase.js";

export const executionsRouter = Router();

function mapExecutionRow(row) {
  return {
    id: row.id,
    tenantId: row.tenantId,
    testCaseId: row.testCaseId,
    browser: row.browser,
    status: row.status,
    startedAt: row.startedAt,
    finishedAt: row.finishedAt
  };
}

executionsRouter.post("/run", async (req, res, next) => {
  try {
    const { tenantId, testCaseId, browsers = ["chromium", "firefox", "webkit"] } = req.body;

    if (!tenantId || !testCaseId) {
      return res.status(400).json({ error: "tenantId and testCaseId are required" });
    }
    if (!isUuid(tenantId) || !isUuid(testCaseId)) {
      return res.status(400).json({ error: "tenantId and testCaseId must be UUIDs" });
    }
    if (!Array.isArray(browsers) || browsers.length === 0) {
      return res.status(400).json({ error: "browsers must be a non-empty array" });
    }

    const tenant = await Tenant.findOne({ id: tenantId }).lean();
    if (!tenant) {
      return res.status(400).json({ error: "tenantId not found" });
    }

    const testCase = await TestCase.findOne({ id: testCaseId, tenantId }).lean();
    if (!testCase) {
      return res.status(404).json({ error: "Test case not found" });
    }

    const created = [];
    for (const browser of browsers) {
      const execution = await Execution.create({
        id: uuidv4(),
        tenantId,
        testCaseId,
        browser,
        status: "queued",
        startedAt: new Date(),
        finishedAt: null
      });
      created.push(mapExecutionRow(execution.toObject()));
    }

    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
});
