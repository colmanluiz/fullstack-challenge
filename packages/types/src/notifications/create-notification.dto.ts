import { IsString, IsEnum, IsOptional, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export enum NotificationType {
  TASK_ASSIGNED = 'task_assigned',
  TASK_UPDATED = 'task_updated',
  COMMENT_CREATED = 'comment_created',
}

export class CreateNotificationDto {
  @ApiProperty({
    example: "75b1b931-9a9d-4d2d-8cbd-9fd6e85bb35f",
    description: "UUID of the user who will receive the notification"
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    example: "task_assigned",
    description: "Type of notification",
    enum: NotificationType
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    example: "Task Assignment",
    description: "Notification title"
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: "You were assigned to task 'Fix Bug #123'",
    description: "Notification message content"
  })
  @IsString()
  message: string;

  @ApiProperty({
    example: { taskId: "uuid", taskTitle: "Fix Bug #123", assignedBy: "John Doe" },
    description: "Additional metadata for the notification",
    required: false
  })
  @IsOptional()
  metadata?: any;
}