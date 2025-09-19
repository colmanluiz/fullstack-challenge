import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "src/entities/comment.entity";
import { Repository } from "typeorm";
import { CreateCommentDto } from "@task-management/types";
import { ValidationService } from "../shared/services/validation.service";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    private readonly validationService: ValidationService
  ) {}

  async createComment(
    createCommentDto: CreateCommentDto,
    taskId: string,
    authorId: string
  ) {
    await this.validationService.validateTaskExists(taskId);
    await this.validationService.validateUserExists(authorId);

    const newComment = this.commentRepository.create({
      ...createCommentDto,
      taskId,
      authorId,
    });

    const savedComment = await this.commentRepository.save(newComment);

    // add rabbitmq event later

    return savedComment;
  }

  async getCommentsByTaskId(taskId: string, page = 1, limit = 10) {
    await this.validationService.validateTaskExists(taskId);

    const [comments, commentsCount] = await this.commentRepository.findAndCount(
      {
        where: { taskId },
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: "DESC" },
      }
    );

    return {
      data: comments,
      meta: {
        total: commentsCount,
        page,
        limit,
        totalPages: Math.ceil(commentsCount / limit),
      },
    };
  }

}
