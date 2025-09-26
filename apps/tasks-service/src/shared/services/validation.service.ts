import { Injectable, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { firstValueFrom } from "rxjs";
import { Task } from "../../entities/task.entity";
import { TaskNotFoundException } from "../exceptions/task-not-found.exception";
import { UserNotFoundException } from "../exceptions/user-not-found.exception";

@Injectable()
export class ValidationService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @Inject("AUTH_SERVICE")
    private readonly authClient: ClientProxy
  ) {}

  async validateUserExists(userId: string): Promise<void> {
    const userExists = await this.authClient.send("user_exists", userId);
    if (!userExists) {
      throw new UserNotFoundException(userId);
    }
  }

  async validateTaskExists(taskId: string): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new TaskNotFoundException(taskId);
    }
  }

  async getUserById(userId: string): Promise<any> {
    try {
      const user = await firstValueFrom(this.authClient.send("get_user_by_id", { userId }));
      return user;
    } catch (error) {
      console.error(`Failed to fetch user ${userId}:`, error);
      return { id: userId, username: `user_${userId.substring(0, 8)}`, email: '' };
    }
  }

  async getUsersByIds(userIds: string[]): Promise<any[]> {
    try {
      const userPromises = userIds.map(id => this.getUserById(id));
      return await Promise.all(userPromises);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return userIds.map(id => ({ id, username: `user_${id.substring(0, 8)}`, email: '' }));
    }
  }

  // Future expansion possibilities:
  // async validateTaskPermissions(userId: string, taskId: string): Promise<void>
  // async validateUserPermissions(userId: string, action: string): Promise<void>
  // async validateTaskStatus(taskId: string, requiredStatus: TaskStatus): Promise<void>
}
