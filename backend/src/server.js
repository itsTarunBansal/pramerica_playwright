import { createApp } from "./app.js";
import { config } from "./config.js";
import { closeDatabase, connectToDatabase } from "./db.js";
import { seedDemoTenant, seedFieldConfigsIfEmpty } from "./startup/seed.js";

async function bootstrap() {
  const app = createApp();

  await connectToDatabase();
  await seedDemoTenant();
  await seedFieldConfigsIfEmpty();

  const server = app.listen(config.port, () => {
    console.log(`Backend listening on port ${config.port}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await closeDatabase();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

bootstrap().catch((err) => {
  console.error("Failed to start backend", err);
  process.exit(1);
});
