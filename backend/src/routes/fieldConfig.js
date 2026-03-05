import { Router } from "express";
import { validate as isUuid, v4 as uuidv4 } from "uuid";
import { FieldConfig } from "../models/fieldConfig.js";

export const fieldConfigRouter = Router();

fieldConfigRouter.get("/", async (req, res, next) => {
  try {
    const { tenantId } = req.query;
    console.log("GET /field-configs - tenantId:", tenantId);
    
    const query = tenantId ? { tenantId, isActive: true } : { isActive: true };
    console.log("Query:", query);
    
    const fields = await FieldConfig.find(query).sort({ order: 1 }).lean();
    console.log("Found fields:", fields.length);
    
    return res.json(fields);
  } catch (err) {
    console.error("Error in GET /field-configs:", err);
    return next(err);
  }
});

fieldConfigRouter.post("/", async (req, res, next) => {
  try {
    const { tenantId, fieldName, label, section, actionType, selector, inputType, selectOptions, defaultValue, order, isRequired } = req.body;

    if (!tenantId || !fieldName || !label || !section || !actionType || order === undefined) {
      return res.status(400).json({ error: "tenantId, fieldName, label, section, actionType, and order are required" });
    }

    const created = await FieldConfig.create({
      id: uuidv4(),
      tenantId,
      fieldName,
      label,
      section,
      actionType,
      selector: selector || "",
      inputType: inputType || "text",
      selectOptions: selectOptions || [],
      defaultValue: defaultValue || "",
      order,
      isRequired: isRequired || false,
      isActive: true
    });

    return res.status(201).json(created.toObject());
  } catch (err) {
    return next(err);
  }
});

fieldConfigRouter.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await FieldConfig.findOneAndUpdate(
      { id },
      { $set: updates },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ error: "Field config not found" });
    }

    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

fieldConfigRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await FieldConfig.findOneAndUpdate(
      { id },
      { $set: { isActive: false } },
      { new: true }
    ).lean();

    if (!deleted) {
      return res.status(404).json({ error: "Field config not found" });
    }

    return res.json({ message: "Field config deleted" });
  } catch (err) {
    return next(err);
  }
});

fieldConfigRouter.post("/reorder", async (req, res, next) => {
  try {
    const { fieldIds } = req.body;

    if (!Array.isArray(fieldIds)) {
      return res.status(400).json({ error: "fieldIds array is required" });
    }

    const updates = fieldIds.map((id, index) =>
      FieldConfig.updateOne({ id }, { $set: { order: index } })
    );

    await Promise.all(updates);
    return res.json({ message: "Fields reordered successfully" });
  } catch (err) {
    return next(err);
  }
});
