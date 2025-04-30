import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Preference } from 'src/preferences/entities/preference.entity'
import { UserPreference } from 'src/preferences/entities/userPreference.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => UserPreference, up => up.user, { cascade: true })
  preferences: UserPreference[];
}

