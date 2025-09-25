export interface Task {
  id: string
  title: string
  description?: string
  deadline: string
  status: TaskStatus
  priority: TaskPriority
  assignees: Array<string>
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface CreateTaskRequest {
  title: string
  description?: string
  deadline: string
  status?: TaskStatus
  priority?: TaskPriority
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  deadline?: string
  status?: TaskStatus
  priority?: TaskPriority
}

export interface Comment {
  id: string
  content: string
  taskId: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateCommentRequest {
  content: string
  taskId: string
}

export interface TaskHistory {
  id: string
  taskId: string
  userId: string
  action: string
  previousValue: any
  newValue: any
  createdAt: string
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  DONE = 'done',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export const TASK_STATUSES = [
  { value: TaskStatus.TODO, label: 'To Do' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
  { value: TaskStatus.IN_REVIEW, label: 'In Review' },
  { value: TaskStatus.DONE, label: 'Done' },
]

export const TASK_PRIORITIES = [
  { value: TaskPriority.LOW, label: 'Low' },
  { value: TaskPriority.MEDIUM, label: 'Medium' },
  { value: TaskPriority.HIGH, label: 'High' },
  { value: TaskPriority.URGENT, label: 'Urgent' },
]
