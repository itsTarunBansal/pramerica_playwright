import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { chromium } from "playwright";
import { writeFileSync, readFileSync, existsSync, unlinkSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { Tenant } from "../models/tenant.js";
import { FieldConfig } from "../models/fieldConfig.js";

export const projectsRouter = Router();

// In-memory map of projectId -> browser instance (so stop can close it)
const activeSessions = new Map();

function actionsFilePath(projectId) {
  return join(tmpdir(), `recorder_${projectId}.json`);
}

// GET all projects
projectsRouter.get("/", async (_req, res, next) => {
  try {
    const projects = await Tenant.find({}).lean();
    return res.json(projects);
  } catch (err) { return next(err); }
});

// GET single project
projectsRouter.get("/:id", async (req, res, next) => {
  try {
    const project = await Tenant.findOne({ id: req.params.id }).lean();
    if (!project) return res.status(404).json({ error: "Project not found" });
    return res.json(project);
  } catch (err) { return next(err); }
});

// POST create project
projectsRouter.post("/", async (req, res, next) => {
  try {
    const { name, url } = req.body;
    if (!name || !url) return res.status(400).json({ error: "name and url are required" });
    const existing = await Tenant.findOne({ name }).lean();
    if (existing) return res.status(409).json({ error: "A project with this name already exists" });
    const created = await Tenant.create({ id: uuidv4(), name, url });
    return res.status(201).json(created.toObject());
  } catch (err) { return next(err); }
});

// PUT update project
projectsRouter.put("/:id", async (req, res, next) => {
  try {
    const { url, name } = req.body;
    const updated = await Tenant.findOneAndUpdate(
      { id: req.params.id },
      { $set: { ...(url && { url }), ...(name && { name }) } },
      { new: true }
    ).lean();
    if (!updated) return res.status(404).json({ error: "Project not found" });
    return res.json(updated);
  } catch (err) { return next(err); }
});

// DELETE project and its field configs
projectsRouter.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await Tenant.findOneAndDelete({ id: req.params.id }).lean();
    if (!deleted) return res.status(404).json({ error: "Project not found" });
    await FieldConfig.deleteMany({ tenantId: req.params.id });
    return res.json({ message: "Project deleted" });
  } catch (err) { return next(err); }
});

// POST /record/start — launches browser non-blocking, returns immediately
projectsRouter.post("/:id/record/start", async (req, res, next) => {
  try {
    const { clearExisting } = req.body;
    const project = await Tenant.findOne({ id: req.params.id }).lean();
    if (!project) return res.status(404).json({ error: "Project not found" });

    // Close any existing session for this project
    if (activeSessions.has(project.id)) {
      try { await activeSessions.get(project.id).close(); } catch (_) {}
      activeSessions.delete(project.id);
    }

    if (clearExisting) {
      await FieldConfig.deleteMany({ tenantId: project.id });
    }

    // Clear previous actions file
    const filePath = actionsFilePath(project.id);
    writeFileSync(filePath, JSON.stringify([]), "utf8");

    // Launch browser — NOT awaited, runs in background
    (async () => {
      try {
        const browser = await chromium.launch({ headless: false, args: ["--start-maximized"] });
        activeSessions.set(project.id, browser);

        const context = await browser.newContext({ viewport: null });

        // Inject recorder BEFORE creating page
        await context.addInitScript(() => {
          window.__recordedActions = window.__recordedActions || [];

          document.addEventListener("click", (e) => {
            const el = e.target;
            if (!el || el.tagName === "HTML" || el.tagName === "BODY") return;
            const selector = el.id ? `#${el.id}`
              : el.getAttribute("name") ? `[name="${el.getAttribute("name")}"]`
              : el.tagName.toLowerCase();
            const label = (el.innerText || "").trim().slice(0, 60)
              || el.getAttribute("aria-label") || el.getAttribute("placeholder")
              || el.getAttribute("name") || el.id || "";
            window.__recordedActions.push({ action: "click", selector, label, tag: el.tagName.toLowerCase(), value: "" });
          }, true);

          document.addEventListener("change", (e) => {
            const el = e.target;
            if (!el) return;
            const selector = el.id ? `#${el.id}`
              : el.getAttribute("name") ? `[name="${el.getAttribute("name")}"]`
              : el.tagName.toLowerCase();
            const label = el.getAttribute("aria-label") || el.getAttribute("placeholder")
              || el.getAttribute("name") || el.id || "";
            const action = el.tagName === "SELECT" ? "select"
              : el.type === "checkbox" ? "check" : "fill";
            window.__recordedActions.push({ action, selector, label, tag: el.tagName.toLowerCase(), value: el.value || "" });
          }, true);
        });

        const page = await context.newPage();
        await page.goto(project.url, { waitUntil: "domcontentloaded", timeout: 30000 });

        // Helper: append new actions to file (never overwrite — survives page reloads)
        async function flushActions() {
          try {
            const newActions = await page.evaluate(() => {
              const a = window.__recordedActions || [];
              window.__recordedActions = []; // clear after reading
              return a;
            });
            if (newActions.length > 0) {
              let existing = [];
              try { existing = JSON.parse(readFileSync(filePath, "utf8")); } catch (_) {}
              writeFileSync(filePath, JSON.stringify([...existing, ...newActions]), "utf8");
            }
          } catch (_) {}
        }

        // Flush every 3 seconds
        const flushInterval = setInterval(flushActions, 3000);

        browser.on("disconnected", async () => {
          clearInterval(flushInterval);
          await flushActions();
          activeSessions.delete(project.id);
        });

      } catch (err) {
        console.error("Recorder launch error:", err.message);
        activeSessions.delete(project.id);
      }
    })();

    return res.json({ status: "recording", message: "Browser launched. Complete your journey then click Done Recording." });
  } catch (err) { return next(err); }
});

// POST /record/stop — reads actions from disk, saves to MongoDB
projectsRouter.post("/:id/record/stop", async (req, res, next) => {
  try {
    const project = await Tenant.findOne({ id: req.params.id }).lean();
    if (!project) return res.status(404).json({ error: "Project not found" });

    // Close browser if still open
    if (activeSessions.has(project.id)) {
      try { await activeSessions.get(project.id).close(); } catch (_) {}
      activeSessions.delete(project.id);
    }

    // Read actions from disk
    const filePath = actionsFilePath(project.id);
    let allActions = [];
    if (existsSync(filePath)) {
      try {
        allActions = JSON.parse(readFileSync(filePath, "utf8"));
      } catch (_) {}
      try { unlinkSync(filePath); } catch (_) {}
    }

    // Convert to fieldConfig documents
    const seen = new Set();
    let order = 0;
    const fieldConfigs = [];

    for (const step of allActions) {
      if (!step.selector || step.selector === "body" || step.selector === "html") continue;
      const key = `${step.action}:${step.selector}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const rawName = (step.label || step.selector)
        .replace(/[^a-zA-Z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "").slice(0, 40);
      if (!rawName) continue;
      const fieldName = rawName.charAt(0).toLowerCase() + rawName.slice(1);

      fieldConfigs.push({
        id: uuidv4(),
        tenantId: project.id,
        fieldName: `${fieldName}_${order}`,
        label: step.label || fieldName,
        section: "Recorded",
        actionType: step.action === "check" ? "check"
          : step.action === "select" ? "select"
          : step.action === "click" ? "click" : "fill",
        selector: step.selector,
        inputType: step.tag === "select" ? "select"
          : (step.tag === "input" && step.action === "check") ? "checkbox" : "text",
        selectOptions: [],
        defaultValue: step.value || "",
        order: order++,
        isRequired: false,
        isActive: true
      });
    }

    if (fieldConfigs.length > 0) {
      await FieldConfig.insertMany(fieldConfigs);
    }

    return res.json({
      message: `Recording complete. ${fieldConfigs.length} fields captured.`,
      fieldCount: fieldConfigs.length,
      projectId: project.id
    });
  } catch (err) { return next(err); }
});

// GET /record/status — check if a recording session is active
projectsRouter.get("/:id/record/status", (req, res) => {
  const isRecording = activeSessions.has(req.params.id);
  return res.json({ isRecording });
});
