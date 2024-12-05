import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  DeleteDateColumn,
} from "typeorm";

export abstract class Model extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number; // Change this to number if using 'increment'

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
