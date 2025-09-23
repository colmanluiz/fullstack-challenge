import {
  Controller,
  Get,
  Put,
  Query,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../guards/auth/jwt-auth.guard";
import { NotificationsService } from "./notifications.service";
import { GetNotificationsDto, MarkAsReadDto } from "@task-management/types";

@ApiTags("notifications")
@Controller("notifications")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: "Get user notifications with pagination" })
  @ApiResponse({
    status: 200,
    description: "Notifications retrieved successfully",
  })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @ApiQuery({ name: "unreadOnly", required: false, type: Boolean, example: false })
  async getUserNotifications(
    @Request() req,
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("unreadOnly") unreadOnly = false
  ) {
    const getUserNotificationsDto: GetNotificationsDto = {
      page: Number(page),
      limit: Number(limit),
      unreadOnly: Boolean(unreadOnly),
    };

    return this.notificationsService.getUserNotifications(
      getUserNotificationsDto,
      req.user.id
    );
  }

  @Put(":id/read")
  @ApiOperation({ summary: "Mark a specific notification as read" })
  @ApiResponse({
    status: 200,
    description: "Notification marked as read successfully",
  })
  @ApiParam({ name: "id", description: "Notification ID" })
  async markNotificationAsRead(@Request() req, @Param("id") notificationId: string) {
    const markAsReadDto: MarkAsReadDto = {
      notificationId,
    };

    return this.notificationsService.markNotificationAsRead(
      markAsReadDto,
      req.user.id
    );
  }

  @Put("read-all")
  @ApiOperation({ summary: "Mark all user notifications as read" })
  @ApiResponse({
    status: 200,
    description: "All notifications marked as read successfully",
  })
  async markAllNotificationsAsRead(@Request() req) {
    return this.notificationsService.markAllNotificationsAsRead(req.user.id);
  }
}