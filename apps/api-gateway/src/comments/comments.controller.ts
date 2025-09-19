import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../guards/auth/jwt-auth.guard";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "@task-management/types";

@ApiTags("comments")
@Controller("tasks/:taskId/comments")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: "Create a comment on a task" })
  @ApiResponse({ status: 201, description: "Comment created successfully" })
  @ApiResponse({ status: 400, description: "Validation error" })
  @ApiResponse({ status: 404, description: "Task not found" })
  async createComment(
    @Param("taskId") taskId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req
  ) {
    const authorId = req.user.id;
    return this.commentsService.createComment(
      createCommentDto,
      taskId,
      authorId
    );
  }

  @Get()
  @ApiOperation({ summary: "Get comments for a task with pagination" })
  @ApiResponse({ status: 200, description: "Comments retrieved successfully" })
  @ApiResponse({ status: 404, description: "Task not found" })
  async getCommentsByTaskId(
    @Param("taskId") taskId: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10
  ) {
    return this.commentsService.getCommentsByTaskId(taskId, page, limit);
  }
}
