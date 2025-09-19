import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";
import { Task } from "../entities/task.entity";
import { TaskAssignment } from "../entities/task-assignment.entity";
import { TaskHistory } from "../entities/task-history.entity";
import { SharedModule } from "../shared/shared.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, TaskAssignment, TaskHistory]),
    SharedModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
