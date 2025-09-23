import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "src/entities/comment.entity";
import { Task } from "src/entities/task.entity";
import { TaskAssignment } from "src/entities/task-assignment.entity";
import { Repository } from "typeorm";
import { CreateCommentDto } from "@task-management/types";
import { ValidationService } from "../shared/services/validation.service";
import { EventsService } from "src/shared/services/events.service";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(TaskAssignment)
    private readonly taskAssignmentRepository: Repository<TaskAssignment>,

    private readonly validationService: ValidationService,
    private readonly eventsService: EventsService
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

    const commentToCreate = await this.commentRepository.save(newComment);

    // Get task assignees and creator for notifications
    const assignees = await this.getTaskAssignees(taskId);
    const task = await this.taskRepository.findOne({ where: { id: taskId } });

    this.eventsService.publishCommentCreated(
      commentToCreate.id,
      createCommentDto,
      taskId,
      authorId,
      assignees,
      task.createdBy
    );

    return commentToCreate;
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

  // Helper method to get assignees for a task
  private async getTaskAssignees(taskId: string): Promise<string[]> {
    const assignments = await this.taskAssignmentRepository.find({
      where: { taskId },
    });
    return assignments.map(assignment => assignment.userId);
  }
}
