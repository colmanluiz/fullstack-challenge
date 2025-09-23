import { ApiProperty } from "@nestjs/swagger";

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
}

export class NotificationResponseDto {
  @ApiProperty({
    example: "75b1b931-9a9d-4d2d-8cbd-9fd6e85bb35f",
    description: "Notification unique identifier"
  })
  id: string;

  @ApiProperty({
    example: "75b1b931-9a9d-4d2d-8cbd-9fd6e85bb35f",
    description: "UUID of the user who receives the notification"
  })
  userId: string;

  @ApiProperty({
    example: "task_assigned",
    description: "Type of notification",
    enum: ["task_assigned", "task_updated", "comment_created"]
  })
  type: string;

  @ApiProperty({
    example: "Task Assignment",
    description: "Notification title"
  })
  title: string;

  @ApiProperty({
    example: "You were assigned to task 'Fix Bug #123'",
    description: "Notification message content"
  })
  message: string;

  @ApiProperty({
    example: { taskId: "uuid", taskTitle: "Fix Bug #123", assignedBy: "John Doe" },
    description: "Additional metadata for the notification",
    required: false
  })
  metadata?: any;

  @ApiProperty({
    example: "unread",
    description: "Notification read status",
    enum: NotificationStatus
  })
  status: NotificationStatus;

  @ApiProperty({
    example: "2025-01-15T10:30:00.000Z",
    description: "Notification creation timestamp"
  })
  createdAt: Date;

  @ApiProperty({
    example: "2025-01-15T10:30:00.000Z",
    description: "Notification last update timestamp"
  })
  updatedAt: Date;
}