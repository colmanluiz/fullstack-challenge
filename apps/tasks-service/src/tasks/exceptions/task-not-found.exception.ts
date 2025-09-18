import { Exception } from "@task-management/exceptions";

export class TaskNotFoundException extends Exception {
  constructor(taskId: string) {
    super(
      `Task with ID ${taskId} not found in database`, // Internal (logs)
      `Task not found`, // External (API response)
      404,
      "tasks-service"
    );
  }
}
