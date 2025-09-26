import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { TasksService } from "./tasks.service";
import { CreateTaskDto, UpdateTaskDto } from "@task-management/types";

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @MessagePattern("create_task")
  async createTask(
    @Payload() data: { createTaskDto: CreateTaskDto; userId: string }
  ) {
    const { createTaskDto, userId } = data;
    return this.tasksService.createTask(createTaskDto, userId);
  }

  @MessagePattern("get_tasks")
  async getTasks(@Payload() data: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = data;
    return this.tasksService.getTasks(page, limit);
  }

  @MessagePattern("get_task_by_id")
  async getTaskById(
    @Payload() data: { taskId: string; includeRelations?: boolean }
  ) {
    const { taskId, includeRelations } = data;
    return this.tasksService.getTaskById(taskId, includeRelations);
  }

  @MessagePattern("update_task")
  async updateTask(
    @Payload()
    data: {
      updateTaskDto: UpdateTaskDto;
      taskId: string;
      userId: string;
    }
  ) {
    const { updateTaskDto, taskId, userId } = data;
    return this.tasksService.updateTask(updateTaskDto, taskId, userId);
  }

  @MessagePattern("delete_task")
  async deleteTask(@Payload() data: { taskId: string; userId: string }) {
    const { taskId, userId } = data;
    return this.tasksService.deleteTask(taskId, userId);
  }

  @MessagePattern("create_task_assignment")
  async createTaskAssignment(
    @Payload() data: { userId: string; taskId: string }
  ) {
    const { userId, taskId } = data;
    return this.tasksService.createTaskAssignment(userId, taskId);
  }

  @MessagePattern("get_task_history")
  async getTaskHistory(@Payload() data: { taskId: string }) {
    const { taskId } = data;
    return this.tasksService.getTaskHistory(taskId);
  }
}
