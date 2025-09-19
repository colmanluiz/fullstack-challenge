import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from "src/entities/comment.entity";
import { CommentsService } from "./comments.service";
import { SharedModule } from "../shared/shared.module";

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), SharedModule],
  controllers: [],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
