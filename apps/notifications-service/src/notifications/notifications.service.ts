import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  CreateNotificationDto,
  GetNotificationsDto,
  MarkAsReadDto,
  NotificationResponseDto,
  NotificationsListResponseDto,
  NotificationStatus,
  NotificationStatusFilter,
} from "@task-management/types";
import { Notification } from "src/entities/notification.entity";
import { Repository } from "typeorm";
import { NotificationNotFoundException } from "./exceptions/notification-not-found.exception";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>
  ) {}

  async createNotification(
    createNotificationDto: CreateNotificationDto
  ): Promise<NotificationResponseDto> {
    const notificationToCreate = this.notificationRepository.create(
      createNotificationDto
    );

    return await this.notificationRepository.save(notificationToCreate);
  }

  async getUserNotifications(
    getUserNotificationsDto: GetNotificationsDto,
    userId: string
  ): Promise<NotificationsListResponseDto> {
    // Build where clause properly to avoid type issues
    const whereClause: any = { userId };

    if (getUserNotificationsDto.status !== NotificationStatusFilter.ALL) {
      whereClause.status = getUserNotificationsDto.status;
    }

    const [notifications, notificationsCount] =
      await this.notificationRepository.findAndCount({
        where: whereClause,
        order: { createdAt: "DESC" },
        skip:
          (getUserNotificationsDto.page - 1) * getUserNotificationsDto.limit,
        take: getUserNotificationsDto.limit,
      });

    return {
      data: notifications,
      meta: {
        total: notificationsCount,
        page: getUserNotificationsDto.page,
        limit: getUserNotificationsDto.limit,
        totalPages: Math.ceil(
          notificationsCount / getUserNotificationsDto.limit
        ),
      },
    };
  }

  async markNotificationAsRead(
    markNotificationAsReadDto: MarkAsReadDto,
    userId: string
  ) {
    const notification = await this.notificationRepository.findOne({
      where: { id: markNotificationAsReadDto.notificationId, userId },
    });

    if (!notification) {
      throw new NotificationNotFoundException(
        markNotificationAsReadDto.notificationId
      );
    }

    notification.status = NotificationStatus.READ;
    return await this.notificationRepository.save(notification);
  }

  async markAllNotificationsAsRead(userId: string) {
    await this.notificationRepository.update(
      { userId, status: NotificationStatus.UNREAD },
      { status: NotificationStatus.READ }
    );
    return { message: "All notifications marked as read" };
  }
}
