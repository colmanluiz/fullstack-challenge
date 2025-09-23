import { IsOptional, IsNumber, Min, Max, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export enum NotificationStatusFilter {
  ALL = 'all',
  UNREAD = 'unread',
  READ = 'read',
}

export class GetNotificationsDto {
  @ApiProperty({
    example: 1,
    description: "Page number for pagination",
    minimum: 1,
    default: 1,
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    example: 10,
    description: "Number of notifications per page",
    minimum: 1,
    maximum: 50,
    default: 10,
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @ApiProperty({
    example: "all",
    description: "Filter notifications by status",
    enum: NotificationStatusFilter,
    default: "all",
    required: false
  })
  @IsOptional()
  @IsEnum(NotificationStatusFilter)
  status?: NotificationStatusFilter = NotificationStatusFilter.ALL;

  @ApiProperty({
    example: false,
    description: "Show only unread notifications",
    default: false,
    required: false
  })
  @IsOptional()
  unreadOnly?: boolean = false;
}