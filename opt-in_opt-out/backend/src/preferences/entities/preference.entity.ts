import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Preference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  pushNotifications: boolean;

  @Column({ default: false })
  emailPromotions: boolean;

  @Column({ default: false })
  smsMessages: boolean;
}
