import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../guards/auth/jwt-auth.guard";
import { TasksService } from "./tasks.service";
import { CreateTaskDto, UpdateTaskDto } from "@task-management/types";

@ApiTags("tasks")
@Controller("tasks")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: "Create a new task" })
  @ApiResponse({ status: 201, description: "Task created successfully" })
  @ApiResponse({ status: 400, description: "Validation error" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async createTask(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    const userId = req.user.id;
    return this.tasksService.createTask(createTaskDto, userId);
  }

  @Get()
  @ApiOperation({ summary: "Get all tasks with pagination" })
  @ApiResponse({ status: 200, description: "Tasks retrieved successfully" })
  async getTasks(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10
  ) {
    return this.tasksService.getTasks(page, limit);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get task by ID" })
  @ApiResponse({ status: 200, description: "Task retrieved successfully" })
  @ApiResponse({ status: 404, description: "Task not found" })
  async getTaskById(
    @Param("id") taskId: string,
    @Query("includeRelations") includeRelations: boolean = false
  ) {
    return this.tasksService.getTaskById(taskId, includeRelations);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update task" })
  @ApiResponse({ status: 200, description: "Task updated successfully" })
  @ApiResponse({ status: 404, description: "Task not found" })
  async updateTask(
    @Param("id") taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req
  ) {
    const userId = req.user.id;
    return this.tasksService.updateTask(updateTaskDto, taskId, userId);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete task" })
  @ApiResponse({ status: 200, description: "Task deleted successfully" })
  @ApiResponse({ status: 404, description: "Task not found" })
  async deleteTask(@Param("id") taskId: string, @Request() req) {
    const userId = req.user.id;
    return this.tasksService.deleteTask(taskId, userId);
  }

  @Post(":id/assign")
  @ApiOperation({ summary: "Assign user to task" })
  @ApiResponse({ status: 200, description: "User assigned successfully" })
  @ApiResponse({ status: 404, description: "Task not found" })
  async assignUserToTask(
    @Param("id") taskId: string,
    @Body() data: { userId: string },
    @Request() req
  ) {
    return this.tasksService.assignUserToTask(data.userId, taskId);
  }

  @Get(":id/history")
  @ApiOperation({ summary: "Get task history" })
  @ApiResponse({
    status: 200,
    description: "Task history retrieved successfully",
  })
  async getTaskHistory(@Param("id") taskId: string) {
    return this.tasksService.getTaskHistory(taskId);
  }
}
