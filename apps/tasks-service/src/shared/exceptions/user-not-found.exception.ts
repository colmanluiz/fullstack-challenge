import { Exception } from "@task-management/exceptions";

export class UserNotFoundException extends Exception {
  constructor(userId: string) {
    super(
      `User with ID ${userId} not found in database`,
      `User not found`,
      404,
      "tasks-service"
    );
  }
}
