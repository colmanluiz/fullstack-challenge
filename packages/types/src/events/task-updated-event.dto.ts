import { UpdateTaskDto } from "../tasks/update-task.dto";

export interface TaskUpdatedEventDto {
  taskId: string;
  changes: UpdateTaskDto;
  updatedBy: string;
  timestamp: string;
}