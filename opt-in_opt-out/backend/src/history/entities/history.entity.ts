import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class History {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  preferenceType: 'push' | 'email' | 'sms';

  @Column()
  action: 'opt-in' | 'opt-out';

  @CreateDateColumn()
  timestamp: Date;
}
