import "reflect-metadata";
import { AppDataSource } from "../utils/data-source";
import { UserSeeder } from "./user.seeder";
import { MenuSeeder } from "./menu.seeder";
import { LunchChoiceSeeder } from "./lunchChoice.seeder";

export class DatabaseSeeder {
  private userSeeder: UserSeeder;
  private menuSeeder: MenuSeeder;
  private lunchChoiceSeeder: LunchChoiceSeeder;

  constructor() {
    this.userSeeder = new UserSeeder();
    this.menuSeeder = new MenuSeeder();
    this.lunchChoiceSeeder = new LunchChoiceSeeder();
  }

  async seed(): Promise<void> {
    console.log("🚀 Starting database seeding...");
    console.log("=====================================");

    try {
      // Seed in order of dependencies
      await this.userSeeder.seed();
      console.log("");
      
      await this.menuSeeder.seed();
      console.log("");
      
      await this.lunchChoiceSeeder.seed();
      console.log("");

      console.log("=====================================");
      console.log("🎉 Database seeding completed successfully!");
      console.log("=====================================");
    } catch (error) {
      console.error("❌ Error during seeding:", error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    console.log("🧹 Starting database cleanup...");
    console.log("=====================================");

    try {
      // Clear in reverse order of dependencies
      await this.lunchChoiceSeeder.clear();
      await this.menuSeeder.clear();
      await this.userSeeder.clear();

      console.log("=====================================");
      console.log("✅ Database cleanup completed!");
      console.log("=====================================");
    } catch (error) {
      console.error("❌ Error during cleanup:", error);
      throw error;
    }
  }

  async refresh(): Promise<void> {
    console.log("🔄 Refreshing database (clear + seed)...");
    await this.clear();
    console.log("");
    await this.seed();
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "seed";

  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log("✅ Database connected successfully!");
    console.log("");

    const seeder = new DatabaseSeeder();

    switch (command) {
      case "seed":
        await seeder.seed();
        break;
      case "clear":
        await seeder.clear();
        break;
      case "refresh":
        await seeder.refresh();
        break;
      case "help":
        console.log("Available commands:");
        console.log("  seed    - Seed the database with sample data");
        console.log("  clear   - Clear all seeded data");
        console.log("  refresh - Clear and then seed the database");
        console.log("  help    - Show this help message");
        break;
      default:
        console.log(`Unknown command: ${command}`);
        console.log("Use 'help' to see available commands");
        process.exit(1);
    }

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    // Close database connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("🔌 Database connection closed");
    }
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

export default DatabaseSeeder;
