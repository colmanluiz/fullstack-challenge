import { Injectable, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { CreateCommentDto } from "@task-management/types";

@Injectable()
export class CommentsService {
  constructor(
    @Inject("TASKS_SERVICE") private readonly tasksClient: ClientProxy
  ) {}

  async createComment(
    createCommentDto: CreateCommentDto,
    taskId: string,
    authorId: string
  ) {
    return firstValueFrom(
      this.tasksClient.send("create_comment", {
        createCommentDto,
        taskId,
        authorId,
      })
    );
  }

  async getCommentsByTaskId(
    taskId: string,
    page: number = 1,
    limit: number = 10
  ) {
    return firstValueFrom(
      this.tasksClient.send("get_task_comments", { taskId, page, limit })
    );
  }
}
