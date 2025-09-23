import { Controller } from "@nestjs/common";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { NotificationsService } from "./notifications.service";
import {
  GetNotificationsDto,
  MarkAsReadDto,
  TaskCreatedEventDto,
  TaskUpdatedEventDto,
  CommentCreatedEventDto,
  NotificationType,
} from "@task-management/types";
import { NotificationsGateway } from "../websocket/notifications.gateway";

@Controller()
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway
  ) {}

  // ===== RabbitMQ Event Handlers =====

  @EventPattern("task.created")
  async handleTaskCreated(@Payload() taskData: TaskCreatedEventDto) {
    const {
      taskId,
      title,
      description,
      priority,
      status,
      deadline,
      createdBy,
      timestamp,
    } = taskData;

    try {
      const notification = await this.notificationsService.createNotification({
        userId: createdBy,
        type: NotificationType.TASK_UPDATED, // Using TASK_UPDATED as general task notification
        title: "Task Created",
        message: `Task "${title}" was created successfully`,
        metadata: {
          taskId,
          title,
          description,
          priority,
          status,
          deadline,
          timestamp,
        },
      });

      this.notificationsGateway.sendNotificationToUser(createdBy, notification);

      console.log(`Notification created for task creation: ${taskId}`);
    } catch (error) {
      console.error("Failed to create task creation notification:", error);
    }
  }

  @EventPattern("task.updated")
  async handleTaskUpdated(@Payload() taskData: TaskUpdatedEventDto) {
    const { taskId, changes, updatedBy, timestamp } = taskData;

    const changesList = Object.keys(changes).join(", ");

    try {
      const notification = await this.notificationsService.createNotification({
        userId: updatedBy, // For now, notify the person who made the update
        type: NotificationType.TASK_UPDATED,
        title: "Task Updated",
        message: `Task was updated. Changes: ${changesList}`,
        metadata: {
          taskId,
          changes,
          timestamp,
        },
      });

      this.notificationsGateway.sendNotificationToUser(updatedBy, notification);

      console.log(`Notification created for task update: ${taskId}`);
    } catch (error) {
      console.error("Failed to create task update notification:", error);
    }
  }

  @EventPattern("comment.created")
  async handleCommentCreated(@Payload() commentData: CommentCreatedEventDto) {
    const { commentId, taskId, content, authorId, timestamp } = commentData;

    const truncatedContent =
      content.length > 50 ? content.substring(0, 50) + "..." : content;

    try {
      const notification = await this.notificationsService.createNotification({
        userId: authorId, // For now, notify the comment author
        type: NotificationType.COMMENT_CREATED,
        title: "Comment Added",
        message: `New comment: "${truncatedContent}"`,
        metadata: {
          commentId,
          taskId,
          content,
          authorId,
          timestamp,
        },
      });

      this.notificationsGateway.sendNotificationToUser(authorId, notification);

      console.log(`Notification created for comment: ${commentId}`);
    } catch (error) {
      console.error("Failed to create comment notification:", error);
    }
  }

  // ===== TCP API Methods (for API Gateway) =====

  @MessagePattern("get_user_notifications")
  async getUserNotifications(
    @Payload()
    data: {
      getUserNotificationsDto: GetNotificationsDto;
      userId: string;
    }
  ) {
    const { getUserNotificationsDto, userId } = data;
    return this.notificationsService.getUserNotifications(
      getUserNotificationsDto,
      userId
    );
  }

  @MessagePattern("mark_notification_as_read")
  async markNotificationAsRead(
    @Payload() data: { markAsReadDto: MarkAsReadDto; userId: string }
  ) {
    const { markAsReadDto, userId } = data;
    return this.notificationsService.markNotificationAsRead(
      markAsReadDto,
      userId
    );
  }

  @MessagePattern("mark_all_notifications_as_read")
  async markAllNotificationsAsRead(@Payload() data: { userId: string }) {
    const { userId } = data;
    return this.notificationsService.markAllNotificationsAsRead(userId);
  }
}
