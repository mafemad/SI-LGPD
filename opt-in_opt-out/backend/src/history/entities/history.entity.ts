import { Preference } from 'src/preferences/entities/preference.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class History {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => Preference)
  preference: Preference;

  @Column()
  action: 'opt-in' | 'opt-out';

  @CreateDateColumn()
  timestamp: Date;
}
