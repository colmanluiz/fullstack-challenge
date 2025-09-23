import { Injectable, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { GetNotificationsDto, MarkAsReadDto } from "@task-management/types";

@Injectable()
export class NotificationsService {
  constructor(
    @Inject("NOTIFICATIONS_SERVICE")
    private readonly notificationsClient: ClientProxy
  ) {}

  async getUserNotifications(getUserNotificationsDto: GetNotificationsDto, userId: string) {
    return firstValueFrom(
      this.notificationsClient.send("get_user_notifications", {
        getUserNotificationsDto,
        userId,
      })
    );
  }

  async markNotificationAsRead(markAsReadDto: MarkAsReadDto, userId: string) {
    return firstValueFrom(
      this.notificationsClient.send("mark_notification_as_read", {
        markAsReadDto,
        userId,
      })
    );
  }

  async markAllNotificationsAsRead(userId: string) {
    return firstValueFrom(
      this.notificationsClient.send("mark_all_notifications_as_read", {
        userId,
      })
    );
  }
}