import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Task } from "./task.entity";

@Entity("task_histories")
export class TaskHistory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  taskId: string;

  @Column({ type: "uuid" })
  userId: string;

  @Column({ type: "varchar" })
  action: string;

  @Column({ type: "json", nullable: true })
  previousValue: any;

  @Column({ type: "json", nullable: true })
  newValue: any;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Task, (task) => task.history, { onDelete: "CASCADE" })
  @JoinColumn({ name: "taskId" })
  task: Task;
}
