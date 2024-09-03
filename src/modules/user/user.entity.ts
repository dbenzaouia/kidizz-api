const { Entity, Column, PrimaryGeneratedColumn } = require('typeorm');

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ unique: true })
  email: string | undefined;

  @Column()
  username: string | undefined;
}