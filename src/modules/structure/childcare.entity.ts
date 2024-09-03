import { User } from "../user/user.entity";

const { Entity, Column, PrimaryGeneratedColumn, ManyToOne } = require('typeorm');

@Entity()
export class Childcare {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name?: string;

  @ManyToOne(() => User, { eager: true }) 
  creator?: User;
}