import http from "http";
import "reflect-metadata";
import dotenv from "dotenv";
import app from "./app";
import { AppDataSource } from "./utils/data-source";

dotenv.config();

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connected successfully with TypeORM!");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error during database initialization:", error);
  }
}

startServer();
