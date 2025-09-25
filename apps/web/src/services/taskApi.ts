import apiClient from '../lib/api'
import {
  type Task,
  type CreateTaskRequest,
  type UpdateTaskRequest,
  type Comment,
  type CreateCommentRequest,
} from '../types/task'

export const taskApi = {
  async getTasks(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ tasks: Task[]; total: number }> {
    const response = await apiClient.get(`/tasks?page=${page}&limit=${limit}`)
    return response.data
  },

  async getTask(id: string): Promise<Task> {
    const response = await apiClient.get(`/tasks/${id}`)
    return response.data
  },

  async createTask(data: CreateTaskRequest): Promise<Task> {
    const response = await apiClient.post('/tasks', data)
    return response.data
  },

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    const response = await apiClient.put(`/tasks/${id}`, data)
    return response.data
  },

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`)
  },

  async getTaskComments(taskId: string): Promise<Comment[]> {
    const response = await apiClient.get(`/tasks/${taskId}/comments`)
    return response.data
  },

  async createComment(data: CreateCommentRequest): Promise<Comment> {
    const response = await apiClient.post(`/tasks/${data.taskId}/comments`, {
      content: data.content,
    })
    return response.data
  },
}

export const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskComments,
  createComment,
} = taskApi
