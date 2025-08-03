import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "dotenv";
import { User } from "../entities/User";
import { LunchChoice } from "../entities/LunchChoice";
import { Menu } from "../entities/Menu";
import { MealTemplate } from "../entities/MealTemplate";
import { WeeklyMealPlan } from "../entities/WeeklyMealPlan";

config(); // Load env first

const DATABASE_URL = process.env.DATABASE_URL;
export const AppDataSource = new DataSource({
  type: "postgres",
  url: DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [User, LunchChoice, Menu, MealTemplate, WeeklyMealPlan],
});
