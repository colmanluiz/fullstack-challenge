import apiClient from '../lib/api'
import type { User } from '@/types/auth'

export const userApi = {
  async getUsers(page: number = 1, limit: number = 100): Promise<Array<User>> {
    const response = await apiClient.get(`/users?page=${page}&limit=${limit}`)
    return response.data.data // Backend returns { data: User[], meta: {...} }
  },

  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get(`/users/${id}`)
    return response.data
  },

  async searchUsers(query: string): Promise<Array<User>> {
    // For now, get all users and filter client-side
    // You could add a search endpoint later
    const users = await this.getUsers(1, 100)
    return users.filter(user =>
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    )
  },
}

export const { getUsers, getUserById, searchUsers } = userApi