import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Task } from "./task.entity";

@Entity("task_assignments")
export class TaskAssignment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  taskId: string;

  @Column({ type: "uuid" })
  userId: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  assignedAt: Date;

  @ManyToOne(() => Task, (task) => task.assignments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "taskId" })
  task: Task;
}
