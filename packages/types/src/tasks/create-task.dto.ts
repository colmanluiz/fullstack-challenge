import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { TaskPriority, TaskStatus } from "./task-enums";

export class CreateTaskDto {
  @ApiProperty({
    description: "Task title",
    example: "Fix login bug",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "Task description",
    example: "Login form is not working properly on mobile devices",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Task deadline",
    example: "2025-01-20T10:00:00Z",
    type: "string",
    format: "date-time",
  })
  @IsDateString()
  @IsNotEmpty()
  deadline: string; // ISO string

  @ApiProperty({
    description: "Task priority level",
    enum: TaskPriority,
    example: TaskPriority.HIGH,
    required: false,
    default: TaskPriority.MEDIUM,
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({
    description: "Task status",
    enum: TaskStatus,
    example: TaskStatus.TODO,
    required: false,
    default: TaskStatus.TODO,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
