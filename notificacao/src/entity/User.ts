import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { randomUUID } from "node:crypto";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar")
  name: string;

  @Column("varchar")
  email: string;
}
