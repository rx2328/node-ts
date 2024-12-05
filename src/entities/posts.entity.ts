import { Column, Entity, ManyToOne } from "typeorm";
import { Model } from "../utils/baseEntity";
import { User } from "./user.entity";

@Entity("posts")
export class Posts extends Model {
  @Column({ nullable: false })
  postTitle: string;

  @Column({ nullable: false })
  postContent: string;

  @ManyToOne(() => User, (user) => user.id, { onDelete: "SET NULL" })
  createdBy: User;
}

export type PostType = typeof Posts;
