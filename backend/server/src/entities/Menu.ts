import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { LunchChoice } from "./LunchChoice";

@Entity("menu")
export class Menu {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  menuname!: string;

  @Column()
  description!: string;

  @Column()
  menudate!: string;

  @Column()
  createdby!: string;

  @Column({ default: false })
  isactive!: boolean;

  @OneToMany(() => LunchChoice, (lunchChoice) => lunchChoice.menu)
  lunchChoices!: LunchChoice[];
}
