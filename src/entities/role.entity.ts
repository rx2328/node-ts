import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("roles")
export class Role extends BaseEntity {
  @Column({ nullable: false })
  role: string;

  @Column({ nullable: false })
  slug: string;

  @PrimaryGeneratedColumn("uuid")
  id: string;
}
