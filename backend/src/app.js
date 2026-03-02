import cors from "cors";
import express from "express";
import { config } from "./config.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { executionsRouter } from "./routes/executions.js";
import { healthRouter } from "./routes/health.js";
import { testCasesRouter } from "./routes/testCases.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: config.corsOrigins,
      credentials: true
    })
  );
  app.use(express.json({ limit: "2mb" }));

  app.get("/", (_req, res) => {
    res.json({ service: "AI Insurance Test Copilot API", status: "running" });
  });

  app.use("/api/v1", healthRouter);
  app.use("/api/v1/test-cases", testCasesRouter);
  app.use("/api/v1/executions", executionsRouter);

  app.use(errorHandler);
  return app;
}

