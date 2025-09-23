import { ApiProperty } from "@nestjs/swagger";
import { NotificationResponseDto } from "./notification-response.dto";

export class NotificationsListResponseDto {
  @ApiProperty({
    description: "Array of notifications",
    type: [NotificationResponseDto]
  })
  data: NotificationResponseDto[];

  @ApiProperty({
    description: "Pagination metadata",
    example: {
      total: 25,
      page: 1,
      limit: 10,
      totalPages: 3
    }
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}