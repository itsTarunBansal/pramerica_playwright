import mongoose from "mongoose";
import { config } from "./config.js";

mongoose.set("strictQuery", true);

export async function connectToDatabase() {
  await mongoose.connect(config.mongoUri, {
    serverSelectionTimeoutMS: 5000
  });
  console.log(`MongoDB connected: ${config.mongoUri}`);
}

export async function closeDatabase() {
  await mongoose.connection.close();
}
