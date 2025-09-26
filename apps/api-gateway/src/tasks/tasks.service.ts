import { Injectable, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { CreateTaskDto, UpdateTaskDto } from "@task-management/types";

@Injectable()
export class TasksService {
  constructor(
    @Inject("TASKS_SERVICE") private readonly tasksClient: ClientProxy
  ) {}

  async createTask(createTaskDto: CreateTaskDto, userId: string) {
    return firstValueFrom(
      this.tasksClient.send("create_task", { createTaskDto, userId })
    );
  }

  async getTasks(page: number = 1, limit: number = 10) {
    return firstValueFrom(this.tasksClient.send("get_tasks", { page, limit }));
  }

  async getTaskById(taskId: string, includeRelations: boolean = false) {
    return firstValueFrom(
      this.tasksClient.send("get_task_by_id", { taskId, includeRelations })
    );
  }

  async updateTask(
    updateTaskDto: UpdateTaskDto,
    taskId: string,
    userId: string
  ) {
    return firstValueFrom(
      this.tasksClient.send("update_task", { updateTaskDto, taskId, userId })
    );
  }

  async deleteTask(taskId: string, userId: string) {
    return firstValueFrom(
      this.tasksClient.send("delete_task", { taskId, userId })
    );
  }

  async createTaskAssignment(userId: string, taskId: string) {
    return firstValueFrom(
      this.tasksClient.send("create_task_assignment", { userId, taskId })
    );
  }

  async getTaskHistory(taskId: string) {
    return firstValueFrom(
      this.tasksClient.send("get_task_history", { taskId })
    );
  }
}
