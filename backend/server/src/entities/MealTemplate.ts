import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import { WeeklyMealPlan } from "./WeeklyMealPlan";
import { MealRating } from "./MealRating";
import { MealSchedule } from "./MealSchedule";

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

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  price?: number; // Cost per serving

  @Column("json", { nullable: true })
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };

  @Column("simple-array", { nullable: true })
  dietaryTags?: string[]; // ["vegetarian", "gluten-free", "halal", etc.]

  @Column("simple-array", { nullable: true })
  allergens?: string[]; // ["nuts", "dairy", "eggs", etc.]

  @Column({ nullable: true })
  imageUrl?: string;

  @Column("decimal", { precision: 2, scale: 1, default: 0 })
  averageRating!: number;

  @Column({ default: 0 })
  totalRatings!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;

  @OneToMany(() => WeeklyMealPlan, (weeklyPlan) => weeklyPlan.mealTemplate)
  weeklyMealPlans!: WeeklyMealPlan[];

  @OneToMany(() => MealRating, (rating) => rating.mealTemplate)
  mealRatings!: MealRating[];

  @OneToMany(() => MealSchedule, (schedule) => schedule.mealTemplate)
  mealSchedules!: MealSchedule[];
}
