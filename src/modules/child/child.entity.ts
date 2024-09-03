import { Childcare } from "../structure/childcare.entity";
import { User } from "../user/user.entity";

const {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} = require('typeorm');

@Entity()
export class Child {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @ManyToOne(() => User, { eager: true })
  creator: User;

  @ManyToMany(() => Childcare)
  @JoinTable({
    name: 'child_childcare',
    joinColumn: { name: 'child_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'childcare_id', referencedColumnName: 'id' },
  })
  childcares?: Childcare[];

  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
