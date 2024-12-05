import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Model } from "../utils/baseEntity";
import { Posts } from "../entities/posts.entity";
import { Role } from "../entities/role.entity";

@Entity("users")
export class User extends Model {
  @Column({ nullable: false })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => Posts, (post) => post.createdBy)
  posts: Posts[];

  //User role default
  @Column({ nullable: false })
  roleId: string;

  @ManyToOne(() => Role)
  @JoinColumn({ referencedColumnName: "id", name: "roleId" })
  role: Role;
}

export type UserType = typeof User;
