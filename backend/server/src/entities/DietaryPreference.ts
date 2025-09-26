import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";

@Entity("dietary_preference")
export class DietaryPreference {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  preference!: string; // "vegetarian", "vegan", "halal", "kosher", "gluten-free", "dairy-free", "nut-free", etc.

  @Column({ nullable: true })
  description?: string; // Additional details about the preference

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.dietaryPreferences)
  user!: User;
}