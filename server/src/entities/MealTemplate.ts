import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import { WeeklyMealPlan } from "./WeeklyMealPlan";

@Entity("meal_template")
export class MealTemplate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  category!: string; // e.g., "Main Course", "Vegetarian", "Light Meal"

  @Column({ default: true })
  isActive!: boolean;

  @Column()
  createdBy!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => WeeklyMealPlan, (weeklyPlan) => weeklyPlan.mealTemplate)
  weeklyMealPlans!: WeeklyMealPlan[];
}
