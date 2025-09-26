import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { MealTemplate } from "./MealTemplate";

@Entity("meal_rating")
export class MealRating {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  mealTemplateId!: number;

  @Column("decimal", { precision: 2, scale: 1 })
  rating!: number; // 1.0 to 5.0

  @Column({ nullable: true })
  comment?: string;

  @Column()
  mealDate!: string; // Date when the meal was consumed

  @CreateDateColumn()
  ratedAt!: Date;

  @ManyToOne(() => User, (user) => user.mealRatings)
  user!: User;

  @ManyToOne(() => MealTemplate, (mealTemplate) => mealTemplate.mealRatings)
  mealTemplate!: MealTemplate;
}