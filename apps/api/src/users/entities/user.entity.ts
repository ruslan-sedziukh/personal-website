import { IsEmail } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  @IsEmail()
  email!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  displayName!: string;

  @Column()
  bio!: string;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt!: Date;
}
