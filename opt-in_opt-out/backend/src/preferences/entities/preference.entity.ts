import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Preference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;
}

