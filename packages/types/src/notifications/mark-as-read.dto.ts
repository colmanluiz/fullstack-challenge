import { IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class MarkAsReadDto {
  @ApiProperty({
    example: "75b1b931-9a9d-4d2d-8cbd-9fd6e85bb35f",
    description: "UUID of the notification to mark as read"
  })
  @IsUUID()
  notificationId: string;
}