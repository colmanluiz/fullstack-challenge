import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Task } from "../entities/task.entity";
import { TaskAssignment } from "../entities/task-assignment.entity";
import { TaskHistory } from "../entities/task-history.entity";
import { TaskNotFoundException } from "../shared/exceptions/task-not-found.exception";
import { CreateTaskDto, UpdateTaskDto } from "@task-management/types";
import { ExistingAssignmentException } from "./exceptions/existing-assignment.exception";
import { ValidationService } from "../shared/services/validation.service";
import { EventsService } from "src/shared/services/events.service";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(TaskAssignment)
    private readonly taskAssignmentRepository: Repository<TaskAssignment>,

    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,

    private readonly validationService: ValidationService,
    private readonly eventsService: EventsService
  ) {}

  async createTask(createTaskDto: CreateTaskDto, userId: string) {
    await this.validationService.validateUserExists(userId);

    const newTask = this.taskRepository.create({
      ...createTaskDto,
      deadline: new Date(createTaskDto.deadline),
      createdBy: userId,
    });
    const taskToCreate = await this.taskRepository.save(newTask);

    // Get assignees for the created task (initially empty for new tasks)
    const assignees = await this.getTaskAssignees(taskToCreate.id);

    this.eventsService.publishTaskCreated(
      taskToCreate.id,
      createTaskDto,
      userId,
      assignees
    );

    await this.createHistoryEntry(
      taskToCreate.id,
      userId,
      "created",
      null,
      taskToCreate
    );

    return taskToCreate;
  }

  async getTasks(page = 1, limit = 10) {
    const [tasks, tasksCount] = await this.taskRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" },
      relations: ["assignments"], // Include task assignments
    });

    // Transform tasks to include assignees with user data
    const tasksWithAssignees = await Promise.all(
      tasks.map(async (task) => {
        const userIds = task.assignments?.map(assignment => assignment.userId) || [];
        const assignees = userIds.length > 0
          ? await this.validationService.getUsersByIds(userIds)
          : [];

        return {
          ...task,
          assignees,
        };
      })
    );

    return {
      data: tasksWithAssignees,
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
    } else {
      // Always include assignments for assignees data
      options.relations = ["assignments"];
    }

    const task = await this.taskRepository.findOne(options);

    if (!task) {
      throw new TaskNotFoundException(id);
    }

    // Add assignees with user data to the response
    const userIds = task.assignments?.map(assignment => assignment.userId) || [];
    const assignees = userIds.length > 0
      ? await this.validationService.getUsersByIds(userIds)
      : [];

    return {
      ...task,
      assignees,
    };
  }

  async updateTask(
    updateTaskDto: UpdateTaskDto,
    taskId: string,
    userId: string
  ) {
    await this.validationService.validateUserExists(userId);
    await this.validationService.validateTaskExists(taskId); // do we need this?

    const taskToUpdate = await this.getTaskById(taskId);
    const previousValue = { ...taskToUpdate };

    const updateData: any = { ...updateTaskDto };
    if (updateTaskDto.deadline) {
      updateData.deadline = new Date(updateTaskDto.deadline); // convert ISO string to Date
    }

    Object.assign(taskToUpdate, updateData);

    await this.taskRepository.save(taskToUpdate);

    // Get current assignees and task creator for notifications
    const assignees = await this.getTaskAssignees(taskToUpdate.id);

    this.eventsService.publishTaskUpdated(
      taskToUpdate.id,
      updateTaskDto,
      userId,
      assignees,
      taskToUpdate.createdBy
    );

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
    await this.validationService.validateTaskExists(taskId);

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

    const savedAssignment = await this.taskAssignmentRepository.save(newTaskAssignment);
    return savedAssignment;
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

  // Helper method to get assignees for a task
  private async getTaskAssignees(taskId: string): Promise<string[]> {
    const assignments = await this.taskAssignmentRepository.find({
      where: { taskId },
    });
    return assignments.map(assignment => assignment.userId);
  }
}
