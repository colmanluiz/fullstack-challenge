import { ApiProperty } from "@nestjs/swagger";

export interface TaskCreatedEventDto {
  taskId: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  deadline: string;
  createdBy: string;
  timestamp: string;
}