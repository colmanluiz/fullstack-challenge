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
      assignees,
      timestamp,
    } = taskData;

    try {
      // Notify assignees about the new task (if any)
      const usersToNotify = assignees.length > 0 ? assignees : [createdBy];

      for (const userId of usersToNotify) {
        const notification = await this.notificationsService.createNotification(
          {
            userId,
            type: NotificationType.TASK_UPDATED,
            title: assignees.includes(userId)
              ? "Task Assigned"
              : "Task Created",
            message: assignees.includes(userId)
              ? `You were assigned to task "${title}"`
              : `Task "${title}" was created successfully`,
            metadata: {
              taskId,
              title,
              description,
              priority,
              status,
              deadline,
              timestamp,
            },
          }
        );

        this.notificationsGateway.sendNotificationToUser(userId, notification);
      }

      console.log(
        `Notifications created for task creation: ${taskId} (${usersToNotify.length} users)`
      );
    } catch (error) {
      console.error("Failed to create task creation notification:", error);
    }
  }

  @EventPattern("task.updated")
  async handleTaskUpdated(@Payload() taskData: TaskUpdatedEventDto) {
    const { taskId, changes, updatedBy, assignees, createdBy, timestamp } =
      taskData;

    const changesList = Object.keys(changes).join(", ");

    try {
      // Notify assignees and task creator (excluding the person who made the update)
      const usersToNotify = [...assignees, createdBy]
        .filter((userId) => userId !== updatedBy) // Exclude the person who made the update
        .filter((userId, index, arr) => arr.indexOf(userId) === index); // Remove duplicates

      for (const userId of usersToNotify) {
        const notification = await this.notificationsService.createNotification(
          {
            userId,
            type: NotificationType.TASK_UPDATED,
            title: "Task Updated",
            message: `Task was updated. Changes: ${changesList}`,
            metadata: {
              taskId,
              changes,
              timestamp,
            },
          }
        );

        this.notificationsGateway.sendNotificationToUser(userId, notification);
      }

      console.log(
        `Notifications created for task update: ${taskId} (${usersToNotify.length} users)`
      );
    } catch (error) {
      console.error("Failed to create task update notification:", error);
    }
  }

  @EventPattern("comment.created")
  async handleCommentCreated(@Payload() commentData: CommentCreatedEventDto) {
    const {
      commentId,
      taskId,
      content,
      authorId,
      assignees,
      createdBy,
      timestamp,
    } = commentData;

    const truncatedContent =
      content.length > 50 ? content.substring(0, 50) + "..." : content;

    try {
      // Notify task participants (assignees + creator) except the comment author
      const usersToNotify = [...assignees, createdBy]
        .filter((userId) => userId !== authorId) // Exclude the comment author
        .filter((userId, index, arr) => arr.indexOf(userId) === index); // Remove duplicates

      for (const userId of usersToNotify) {
        const notification = await this.notificationsService.createNotification(
          {
            userId,
            type: NotificationType.COMMENT_CREATED,
            title: "New Comment",
            message: `New comment: "${truncatedContent}"`,
            metadata: {
              commentId,
              taskId,
              content,
              authorId,
              timestamp,
            },
          }
        );

        this.notificationsGateway.sendNotificationToUser(userId, notification);
      }

      console.log(
        `Notifications created for comment: ${commentId} (${usersToNotify.length} users)`
      );
    } catch (error) {
      console.error("Failed to create comment notification:", error);
    }
  }

  @EventPattern("task.assigned")
  async handleTaskAssigned(
    @Payload()
    assignmentData: {
      taskId: string;
      userId: string;
      assignedAt: string;
    }
  ) {
    const { taskId, userId, assignedAt } = assignmentData;

    try {
      const notification = await this.notificationsService.createNotification({
        userId,
        type: NotificationType.TASK_ASSIGNED,
        title: "Task Assigned",
        message: `You have been assigned to a new task.`,
        metadata: {
          taskId,
          assignedAt,
        },
      });

      this.notificationsGateway.sendNotificationToUser(userId, notification);
    } catch (error) {
      console.error("Failed to create task assigned notification:", error);
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
