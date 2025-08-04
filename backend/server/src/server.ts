import http from "http";
import "reflect-metadata";
import dotenv from "dotenv";
import app from "./app";
import { AppDataSource } from "./utils/data-source";
import { notificationService } from "./services/notification.service";

dotenv.config();

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connected successfully with TypeORM!");

    // Initialize notification service
    await notificationService.connect();
    console.log("📧 Notification service initialized");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('🛑 Shutting down gracefully...');
      await notificationService.close();
      await AppDataSource.destroy();
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error("❌ Error during database initialization:", error);
  }
}

startServer();
