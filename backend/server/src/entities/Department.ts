import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { MealSchedule } from "./MealSchedule";

@Entity("department")
export class Department {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  manager?: string; // Manager name or ID

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  mealBudget?: number; // Monthly budget for meals

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;

  @OneToMany(() => User, (user) => user.department)
  users!: User[];

  @OneToMany(() => MealSchedule, (schedule) => schedule.department)
  mealSchedules!: MealSchedule[];
}