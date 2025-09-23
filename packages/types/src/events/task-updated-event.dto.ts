import { UpdateTaskDto } from "../tasks/update-task.dto";

export interface TaskUpdatedEventDto {
  taskId: string;
  changes: UpdateTaskDto;
  updatedBy: string;
  assignees: string[]; // Current assignees after update
  createdBy: string; // Original task creator
  timestamp: string;
}