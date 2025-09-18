import { Exception } from "@task-management/exceptions";

export class ExistingAssignmentException extends Exception {
  constructor(taskId: string, userId: string) {
    super(
      `User with ID ${userId} is already assigned to task with ID ${taskId}`,
      `Existing assignment`,
      400,
      "tasks-service"
    );
  }
}
