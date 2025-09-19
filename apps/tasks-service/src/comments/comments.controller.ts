import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "@task-management/types";

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @MessagePattern("create_comment")
  async createComment(
    @Payload()
    data: {
      createCommentDto: CreateCommentDto;
      taskId: string;
      authorId: string;
    }
  ) {
    const { createCommentDto, taskId, authorId } = data;
    return this.commentsService.createComment(
      createCommentDto,
      taskId,
      authorId
    );
  }

  @MessagePattern("get_task_comments")
  async getCommentsByTaskId(
    @Payload() data: { taskId: string; page?: number; limit?: number }
  ) {
    const { taskId, page = 1, limit = 10 } = data;
    return this.commentsService.getCommentsByTaskId(taskId, page, limit);
  }
}
