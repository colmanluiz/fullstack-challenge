import { Injectable, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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

  // Future expansion possibilities:
  // async validateTaskPermissions(userId: string, taskId: string): Promise<void>
  // async validateUserPermissions(userId: string, action: string): Promise<void>
  // async validateTaskStatus(taskId: string, requiredStatus: TaskStatus): Promise<void>
}
