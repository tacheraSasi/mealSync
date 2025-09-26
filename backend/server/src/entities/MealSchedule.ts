import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { MealTemplate } from "./MealTemplate";
import { Department } from "./Department";

@Entity("meal_schedule")
export class MealSchedule {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  mealTemplateId!: number;

  @Column()
  scheduledDate!: string; // Format: "2024-08-05"

  @Column()
  mealType!: string; // "breakfast", "lunch", "dinner", "snack"

  @Column({ nullable: true })
  departmentId?: number; // If meal is for specific department

  @Column({ default: "available" })
  status!: string; // "available", "confirmed", "cancelled"

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  unitPrice?: number;

  @Column({ default: 0 })
  maxQuantity!: number; // Maximum number of orders allowed

  @Column({ default: 0 })
  currentOrders!: number; // Current number of orders

  @Column({ type: "timestamp", nullable: true })
  orderDeadline?: Date; // Deadline for ordering

  @Column({ nullable: true })
  specialInstructions?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;

  @ManyToOne(() => MealTemplate, (mealTemplate) => mealTemplate.mealSchedules)
  mealTemplate!: MealTemplate;

  @ManyToOne(() => Department, (department) => department.mealSchedules, { nullable: true })
  department?: Department;
}