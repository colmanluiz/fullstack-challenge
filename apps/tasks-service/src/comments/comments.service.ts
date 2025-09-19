import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "src/entities/comment.entity";
import { Repository } from "typeorm";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { Task } from "src/entities/task.entity";
import { TaskNotFoundException } from "src/tasks/exceptions/task-not-found.exception";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>
  ) {}

  async createComment(
    createCommentDto: CreateCommentDto,
    taskId: string,
    authorId: string
  ) {
    await this.validateTaskExists(taskId);

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
    await this.validateTaskExists(taskId);

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

  private async validateTaskExists(taskId: string): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });

    if (!task) {
      throw new TaskNotFoundException(taskId);
    }

    // do we really need to fetch tasks here?
    // add a tradeoff later, this is using a cross-domain validation
  }
}
