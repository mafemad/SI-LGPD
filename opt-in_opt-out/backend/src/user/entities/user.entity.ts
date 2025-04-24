import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Preference } from 'src/preferences/entities/preference.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToOne(() => Preference, { cascade: true, eager: true })
  @JoinColumn()
  preference: Preference;
}
