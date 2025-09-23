import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from "src/entities/comment.entity";
import { Task } from "src/entities/task.entity";
import { TaskAssignment } from "src/entities/task-assignment.entity";
import { CommentsService } from "./comments.service";
import { CommentsController } from "./comments.controller";
import { SharedModule } from "../shared/shared.module";

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Task, TaskAssignment]), SharedModule],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
