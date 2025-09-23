export interface CommentCreatedEventDto {
  commentId: string;
  taskId: string;
  content: string;
  authorId: string;
  assignees: string[]; // Task assignees
  createdBy: string; // Task creator
  timestamp: string;
}