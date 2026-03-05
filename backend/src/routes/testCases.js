import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { Tenant } from "../models/tenant.js";
import { TestCase } from "../models/testCase.js";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUuid = (v) => UUID_RE.test(v);

export const testCasesRouter = Router();

function mapRow(row) {
  return {
    id: row.id,
    tenantId: row.tenantId,
    name: row.name,
    appUrl: row.appUrl,
    insuranceInput: row.insuranceInput,
    steps: row.steps,
    createdBy: row.createdBy,
    createdAt: row.createdAt
  };
}

testCasesRouter.post("/", async (req, res, next) => {
  try {
    const { tenantId, name, appUrl, insuranceInput = null, steps = [], createdBy = null } = req.body;

    if (!tenantId || !name || !appUrl || !Array.isArray(steps)) {
      return res.status(400).json({ error: "tenantId, name, appUrl, and steps[] are required" });
    }
    if (!isUuid(tenantId)) {
      return res.status(400).json({ error: "tenantId must be a UUID" });
    }

    const tenant = await Tenant.findOne({ id: tenantId }).lean();
    if (!tenant) {
      return res.status(400).json({ error: "tenantId not found" });
    }

    const created = await TestCase.create({
      id: uuidv4(),
      tenantId,
      name,
      appUrl,
      insuranceInput,
      steps,
      createdBy
    });

    return res.status(201).json(mapRow(created.toObject()));
  } catch (err) {
    return next(err);
  }
});

testCasesRouter.get("/", async (_req, res, next) => {
  try {
    const rows = await TestCase.find({}).sort({ createdAt: -1 }).lean();
    return res.json(rows.map(mapRow));
  } catch (err) {
    return next(err);
  }
});

testCasesRouter.get("/:testCaseId", async (req, res, next) => {
  try {
    const { testCaseId } = req.params;
    if (!isUuid(testCaseId)) {
      return res.status(400).json({ error: "testCaseId must be a UUID" });
    }

    const row = await TestCase.findOne({ id: testCaseId }).lean();
    if (!row) {
      return res.status(404).json({ error: "Test case not found" });
    }
    return res.json(mapRow(row));
  } catch (err) {
    return next(err);
  }
});
