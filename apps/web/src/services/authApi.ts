import apiClient from '../lib/api'
import {
  type AuthResponse,
  type LoginRequest,
  type RegisterRequest,
  type RefreshRequest,
  type User,
} from '../types/auth'

export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },

  async refreshToken(data: RefreshRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/refresh', data)
    return response.data
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post('/auth/logout', { refreshToken })
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/users/me')
    return response.data
  },
}

export const { login, register, refreshToken, logout } = authApi
