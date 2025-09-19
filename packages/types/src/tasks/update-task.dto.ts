import { IsString, IsOptional, IsDateString, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { TaskPriority, TaskStatus } from "./task-enums";

export class UpdateTaskDto {
  @ApiProperty({
    description: "Task title",
    example: "Fix login bug - Updated",
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: "Task description",
    example: "Updated description with more details",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Task deadline",
    example: "2025-01-25T15:00:00Z",
    type: "string",
    format: "date-time",
    required: false,
  })
  @IsDateString()
  @IsOptional()
  deadline?: string; // ISO string - consistent with CreateTaskDto

  @ApiProperty({
    description: "Task priority level",
    enum: TaskPriority,
    example: TaskPriority.URGENT,
    required: false,
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({
    description: "Task status",
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
    required: false,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
