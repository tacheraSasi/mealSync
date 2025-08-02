import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "dotenv";
import { User } from "../entities/User";
import { LunchChoice } from "../entities/LunchChoice";
import { Menu } from "../entities/Menu";

config(); // Load env first

const DATABASE_URL = process.env.DATABASE_URL;
export const AppDataSource = new DataSource({
  type: "postgres",
  url: DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [User, LunchChoice, Menu],
});
