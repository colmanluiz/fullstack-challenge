export interface CommentCreatedEventDto {
  commentId: string;
  taskId: string;
  content: string;
  authorId: string;
  timestamp: string;
}