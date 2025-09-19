import { Exception } from "@task-management/exceptions";

export class TaskNotFoundException extends Exception {
  constructor(taskId: string) {
    super(
      `Task with ID ${taskId} not found in database`,
      `Task not found`,
      404,
      "tasks-service"
    );
  }
}
