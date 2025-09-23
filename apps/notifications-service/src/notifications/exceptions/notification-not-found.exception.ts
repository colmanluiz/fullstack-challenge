import { Exception } from "@task-management/exceptions";

export class NotificationNotFoundException extends Exception {
  constructor(notificationId: string) {
    super(
      `Notification with ID ${notificationId} not found or access denied`,
      "Notification not found",
      404,
      "NotificationsService"
    );
  }
}