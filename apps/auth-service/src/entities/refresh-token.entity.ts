import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string; // The actual refresh token

  @Column()
  userId: number;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isRevoked: boolean; // For token revocation

  // Many refresh tokens belong to one user
  @ManyToOne(() => User, (user) => user.refreshTokens, {
    onDelete: 'CASCADE', // If user is deleted, delete their tokens too
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}