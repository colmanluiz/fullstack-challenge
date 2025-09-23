import { ApiProperty } from "@nestjs/swagger";

export interface TaskCreatedEventDto {
  taskId: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  deadline: string;
  createdBy: string;
  assignees: string[]; // Array of user IDs assigned to the task
  timestamp: string;
}