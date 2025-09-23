import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import {
  CreateCommentDto,
  CreateTaskDto,
  UpdateTaskDto,
  TaskCreatedEventDto,
  TaskUpdatedEventDto,
  CommentCreatedEventDto,
} from "@task-management/types";

@Injectable()
export class EventsService {
  constructor(
    @Inject("EVENTS_SERVICE")
    private readonly eventsClient: ClientProxy
  ) {}

  publishTaskCreated(
    taskId: string,
    createTaskDto: CreateTaskDto,
    userId: string
  ): void {
    const eventPayload: TaskCreatedEventDto = {
      taskId,
      title: createTaskDto.title,
      description: createTaskDto.description,
      priority: createTaskDto.priority,
      status: createTaskDto.status,
      deadline: createTaskDto.deadline,
      createdBy: userId,
      timestamp: new Date().toISOString(),
    };

    this.eventsClient.emit("task.created", eventPayload);
  }

  publishTaskUpdated(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
    userId: string
  ): void {
    const eventPayload: TaskUpdatedEventDto = {
      taskId,
      changes: updateTaskDto,
      updatedBy: userId,
      timestamp: new Date().toISOString(),
    };

    this.eventsClient.emit("task.updated", eventPayload);
  }

  publishCommentCreated(
    commentId: string,
    createCommentDto: CreateCommentDto,
    taskId: string,
    authorId: string
  ): void {
    const eventPayload: CommentCreatedEventDto = {
      commentId,
      taskId,
      content: createCommentDto.content,
      authorId,
      timestamp: new Date().toISOString(),
    };

    this.eventsClient.emit("comment.created", eventPayload);
  }
}
