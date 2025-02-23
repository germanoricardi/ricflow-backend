import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
} from 'typeorm';

@Entity('users', { orderBy: { userName: 'ASC' } })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ unique: true, nullable: true }) // Allows linking with Keycloak later
  subjectId?: string;

  @Column({ unique: true, length: 100 })
  userName: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255, nullable: true })
  passwordHash?: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
