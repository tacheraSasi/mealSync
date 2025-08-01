import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "dotenv";
import { User } from "../entities/User";
import { LunchChoice } from "../entities/LunchChoice";
import { Menu } from "../entities/Menu";

config(); // Load .env variables

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL, // Use DATABASE_URL from .env
  synchronize: true, // ❗Set to false in production, use migrations instead
  logging: false,
  entities: [User, LunchChoice, Menu],
});
