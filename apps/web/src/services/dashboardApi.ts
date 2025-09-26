import apiClient from '@/lib/api'
import type { Task } from '@/types/task'

export interface DashboardStats {
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  overdueTasksCount: number
  tasksByPriority: {
    low: number
    medium: number
    high: number
    urgent: number
  }
  tasksByStatus: {
    todo: number
    in_progress: number
    in_review: number
    done: number
  }
  recentTasks: Task[]
  tasksCreatedThisWeek: number
  tasksCompletedThisWeek: number
}

export interface TaskActivity {
  date: string
  created: number
  completed: number
}

export const dashboardApi = {
  async getDashboardStats(): Promise<DashboardStats> {
    // For now, we'll calculate stats from all tasks
    // In a real app, you'd have dedicated dashboard endpoints
    const response = await apiClient.get('/tasks?page=1&limit=1000')
    const tasks: Task[] = Array.isArray(response.data) ? response.data : response.data.data || []

    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Calculate basic stats
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(task => task.status === 'done').length
    const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length
    const overdueTasksCount = tasks.filter(task =>
      task.deadline && new Date(task.deadline) < now && task.status !== 'done'
    ).length

    // Tasks by priority
    const tasksByPriority = {
      low: tasks.filter(task => task.priority === 'low').length,
      medium: tasks.filter(task => task.priority === 'medium').length,
      high: tasks.filter(task => task.priority === 'high').length,
      urgent: tasks.filter(task => task.priority === 'urgent').length,
    }

    // Tasks by status
    const tasksByStatus = {
      todo: tasks.filter(task => task.status === 'todo').length,
      in_progress: tasks.filter(task => task.status === 'in_progress').length,
      in_review: tasks.filter(task => task.status === 'in_review').length,
      done: tasks.filter(task => task.status === 'done').length,
    }

    // Recent tasks (last 5)
    const recentTasks = tasks
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)

    // Weekly stats
    const tasksCreatedThisWeek = tasks.filter(task =>
      new Date(task.createdAt) >= oneWeekAgo
    ).length

    const tasksCompletedThisWeek = tasks.filter(task =>
      task.status === 'done' && new Date(task.updatedAt) >= oneWeekAgo
    ).length

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasksCount,
      tasksByPriority,
      tasksByStatus,
      recentTasks,
      tasksCreatedThisWeek,
      tasksCompletedThisWeek,
    }
  },

  async getTaskActivity(days: number = 30): Promise<TaskActivity[]> {
    // Generate last N days of task activity
    const response = await apiClient.get('/tasks?page=1&limit=1000')
    const tasks: Task[] = Array.isArray(response.data) ? response.data : response.data.data || []

    const activity: TaskActivity[] = []
    const now = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]

      const created = tasks.filter(task =>
        task.createdAt.split('T')[0] === dateStr
      ).length

      const completed = tasks.filter(task =>
        task.status === 'done' && task.updatedAt.split('T')[0] === dateStr
      ).length

      activity.push({
        date: dateStr,
        created,
        completed,
      })
    }

    return activity
  }
}