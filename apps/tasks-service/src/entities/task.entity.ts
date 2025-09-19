import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { TaskAssignment } from "./task-assignment.entity";
import { TaskHistory } from "./task-history.entity";
import { Comment } from "./comment.entity";
import { TaskPriority, TaskStatus } from "@task-management/types";

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "timestamp" })
  deadline: Date;

  @Column({ type: "enum", enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @Column({ type: "enum", enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @Column({ type: "uuid" })
  createdBy: string; // User ID of the task creator

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];

  @OneToMany(() => TaskAssignment, (assignment) => assignment.task)
  assignments: TaskAssignment[];

  @OneToMany(() => TaskHistory, (history) => history.task)
  history: TaskHistory[];
}
