import { Preference } from 'src/preferences/entities/preference.entity';
import { ConsentTerm } from 'src/consent-term/entities/consentTerm.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class History {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => Preference, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: true,
  })
  preference: Preference | null;

  @Column()
  preferenceName: string;

  @Column()
  action: 'opt-in' | 'opt-out';

  @ManyToOne(() => ConsentTerm, {
    nullable: true,
    eager: true,
    onDelete: 'SET NULL',
  })
  consentTerm: ConsentTerm | null;

  @CreateDateColumn()
  timestamp: Date;
}
