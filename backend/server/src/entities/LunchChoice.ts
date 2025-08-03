import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Menu } from "./Menu";

@Entity("lunchchoice")
export class LunchChoice {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userid!: number;

  @Column()
  username!: string;

  @Column()
  menuid!: number;

  @Column()
  menuname!: string;

  @Column()
  menudate!: string;

  @ManyToOne(() => User, (user) => user.lunchChoices)
  user!: User;

  @ManyToOne(() => Menu, (menu) => menu.lunchChoices)
  menu!: Menu;
}
