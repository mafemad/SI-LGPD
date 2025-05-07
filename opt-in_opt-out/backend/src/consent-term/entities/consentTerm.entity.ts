import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Preference } from 'src/preferences/entities/preference.entity';

@Entity()
export class ConsentTerm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  version: number;

  @Column('text')
  content: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Preference, { eager: true })
  @JoinTable()
  preferences: Preference[];
}
