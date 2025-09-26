import apiClient from '@/lib/api'
import type { Notification } from '@/types/notification'

export const notificationApi = {
  async getNotifications(): Promise<Notification[]> {
    const response = await apiClient.get(`/notifications`)
    // Handle different response formats
    if (Array.isArray(response.data)) {
      return response.data
    } else if (response.data && Array.isArray(response.data.data)) {
      return response.data.data
    } else {
      console.warn('⚠️ Unexpected API response format:', response.data)
      return []
    }
  },

  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.put(`/notifications/${notificationId}/read`)
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.put(`/notifications/read-all`)
  },
}
