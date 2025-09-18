import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { TaskAssignment } from '../entities/task-assignment.entity';
import { TaskHistory } from '../entities/task-history.entity';
import { TaskNotFoundException } from './exceptions/task-not-found.exception';

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

  // TODO: Implement remaining service methods:
  // - createTask
  // - updateTask
  // - deleteTask
  // - assignUsersToTask
  // - getTaskHistory
}