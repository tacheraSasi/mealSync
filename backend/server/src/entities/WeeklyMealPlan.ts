import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { MealTemplate } from "./MealTemplate";

@Entity("weekly_meal_plan")
export class WeeklyMealPlan {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  username!: string;

  @Column()
  mealTemplateId!: number;

  @Column()
  mealName!: string;

  @Column()
  weekStartDate!: string; // Format: "2024-08-05" (Monday of the week)

  @Column()
  dayOfWeek!: string; // "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"

  @Column({ default: "pending" })
  status!: string; // "pending", "confirmed", "cancelled"

  @CreateDateColumn()
  selectedAt!: Date;

  @ManyToOne(() => User, (user) => user.weeklyMealPlans)
  user!: User;

  @ManyToOne(() => MealTemplate, (mealTemplate) => mealTemplate.weeklyMealPlans)
  mealTemplate!: MealTemplate;
}
