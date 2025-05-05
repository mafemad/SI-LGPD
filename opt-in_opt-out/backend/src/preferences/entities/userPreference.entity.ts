import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Preference } from "./preference.entity";

@Entity()
export class UserPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.preferences, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Preference, { onDelete: 'CASCADE' })
  preference: Preference;

  @Column()
  optedIn: boolean;
}
