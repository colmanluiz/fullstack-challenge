import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TasksService } from './tasks.service';

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // TODO: Add @MessagePattern decorators and methods for:
  // - create_task
  // - get_tasks
  // - get_task_by_id
  // - update_task
  // - delete_task
  // - assign_users_to_task
}