import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ConsentTerm } from './consentTerm.entity';

@Entity()
export class UserConsent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => ConsentTerm, { eager: true, onDelete: 'CASCADE' })
  consentTerm: ConsentTerm;

  @CreateDateColumn()
  acceptedAt: Date;
}
