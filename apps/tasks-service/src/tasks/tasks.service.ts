import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Task } from "../entities/task.entity";
import { TaskAssignment } from "../entities/task-assignment.entity";
import { TaskHistory } from "../entities/task-history.entity";
import { TaskNotFoundException } from "./exceptions/task-not-found.exception";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(TaskAssignment)
    private readonly taskAssignmentRepository: Repository<TaskAssignment>,

    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>
  ) {}

  async createTask(createTaskDto: CreateTaskDto, createdByUserId: string) {
    const newTask = this.taskRepository.create({
      ...createTaskDto,
      deadline: new Date(createTaskDto.deadline), // this convert our string into Date
      createdBy: createdByUserId,
    });
    const savedTask = await this.taskRepository.save(newTask);

    return savedTask;
  }

  async getTasks() {
    return await this.taskRepository.find(); // TODO: add pagination
  }

  async getTaskById(id: string) {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new TaskNotFoundException(id);
    }

    return task;
  }

  async updateTask(updateTaskDto: UpdateTaskDto, taskId: string) {
    const taskToUpdate = await this.getTaskById(taskId);
    Object.assign(taskToUpdate, updateTaskDto);

    await this.taskRepository.save(taskToUpdate);
    return taskToUpdate;
  }

  async deleteTask(taskId: string) {
    const taskToRemove = await this.getTaskById(taskId);

    await this.taskRepository.remove(taskToRemove);
    return { message: `Task with ID ${taskId} has been deleted.` };
  }

  // TODO: Implement remaining service methods:
  // - createTask
  // - updateTask
  // - deleteTask
  // - assignUsersToTask
  // - getTaskHistory
}
