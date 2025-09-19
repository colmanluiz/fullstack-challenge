import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Task } from "../entities/task.entity";
import { TaskAssignment } from "../entities/task-assignment.entity";
import { TaskHistory } from "../entities/task-history.entity";
import { TaskNotFoundException } from "../shared/exceptions/task-not-found.exception";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { ExistingAssignmentException } from "./exceptions/existing-assignment.exception";
import { ValidationService } from "../shared/services/validation.service";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(TaskAssignment)
    private readonly taskAssignmentRepository: Repository<TaskAssignment>,

    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,

    private readonly validationService: ValidationService
  ) {}

  async createTask(createTaskDto: CreateTaskDto, userId: string) {
    await this.validationService.validateUserExists(userId);

    const newTask = this.taskRepository.create({
      ...createTaskDto,
      deadline: new Date(createTaskDto.deadline), // this convert our string into Date
      createdBy: userId,
    });
    const savedTask = await this.taskRepository.save(newTask);

    await this.createHistoryEntry(
      savedTask.id,
      userId,
      "created",
      null,
      savedTask
    );

    return savedTask;
  }

  async getTasks(page = 1, limit = 10) {
    const [tasks, tasksCount] = await this.taskRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" },
    });

    return {
      data: tasks,
      meta: {
        total: tasksCount,
        page,
        limit,
        totalPages: Math.ceil(tasksCount / limit),
      },
    };
  }

  async getTaskById(id: string, includeRelations = false) {
    const options: any = { where: { id } };

    if (includeRelations) {
      options.relations = ["assignments", "comments", "history"];
    }

    const task = await this.taskRepository.findOne(options);

    if (!task) {
      throw new TaskNotFoundException(id);
    }

    return task;
  }

  async updateTask(
    updateTaskDto: UpdateTaskDto,
    taskId: string,
    userId: string
  ) {
    await this.validationService.validateUserExists(userId);

    const taskToUpdate = await this.getTaskById(taskId);
    const previousValue = { ...taskToUpdate };

    const updateData = { ...updateTaskDto };
    if (updateTaskDto.deadline) {
      updateData.deadline = new Date(updateTaskDto.deadline);
    }

    Object.assign(taskToUpdate, updateData);

    await this.taskRepository.save(taskToUpdate);

    await this.createHistoryEntry(
      taskId,
      userId,
      "updated",
      previousValue,
      taskToUpdate
    );

    return taskToUpdate;
  }

  async deleteTask(taskId: string, userId: string) {
    await this.validationService.validateUserExists(userId);

    const taskToRemove = await this.getTaskById(taskId);

    await this.createHistoryEntry(
      taskId,
      userId,
      "deleted",
      taskToRemove,
      null
    );

    await this.taskRepository.remove(taskToRemove);
    return { message: `Task with ID ${taskId} has been deleted.` };
  }

  async assignUsersToTask(userId: string, taskId: string) {
    await this.validationService.validateUserExists(userId);
    await this.getTaskById(taskId);

    const existingAssignment = await this.taskAssignmentRepository.findOne({
      where: { userId, taskId },
    });

    if (existingAssignment) {
      throw new ExistingAssignmentException(taskId, userId);
    }

    const newTaskAssignment = this.taskAssignmentRepository.create({
      userId,
      taskId,
    });

    await this.taskAssignmentRepository.save(newTaskAssignment);
    return newTaskAssignment;
  }

  async getTaskHistory(taskId: string) {
    return await this.taskHistoryRepository.find({
      where: { taskId },
      order: { createdAt: "DESC" },
    });
  }

  private async createHistoryEntry(
    taskId: string,
    userId: string,
    action: string,
    previousValue: any,
    newValue: any
  ) {
    const historyEntry = this.taskHistoryRepository.create({
      taskId,
      userId,
      action,
      previousValue,
      newValue,
    });

    await this.taskHistoryRepository.save(historyEntry);
  }
}
