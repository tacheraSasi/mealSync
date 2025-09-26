import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { LunchChoice } from "./LunchChoice";
import { WeeklyMealPlan } from "./WeeklyMealPlan";
import { DietaryPreference } from "./DietaryPreference";
import { MealRating } from "./MealRating";
import { Department } from "./Department";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column()
  password!: string;

  @Column({ default: "user" })
  role!: string;

  @Column({ nullable: true })
  departmentId?: number;

  @Column({ nullable: true })
  jobTitle?: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: true })
  notificationsEnabled!: boolean;

  @Column({ type: "timestamp", nullable: true })
  lastLogin?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;

  @OneToMany(() => LunchChoice, (lunchChoice) => lunchChoice.user)
  lunchChoices!: LunchChoice[];

  @OneToMany(() => WeeklyMealPlan, (weeklyPlan) => weeklyPlan.user)
  weeklyMealPlans!: WeeklyMealPlan[];

  @OneToMany(() => DietaryPreference, (preference) => preference.user)
  dietaryPreferences!: DietaryPreference[];

  @OneToMany(() => MealRating, (rating) => rating.user)
  mealRatings!: MealRating[];

  @ManyToOne(() => Department, (department) => department.users)
  department!: Department;
}
