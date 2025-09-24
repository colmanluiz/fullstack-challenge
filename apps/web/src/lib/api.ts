import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios'

const API_BASE_URL = 'http://localhost:3001/api' // todo: move to env variable

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

export const tokenStorage = {
  getAccessToken: (): string | null => localStorage.getItem('accessToken'),
  getRefreshToken: (): string | null => localStorage.getItem('refreshToken'),

  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  },

  clearTokens: (): void => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken()

    if (token) {
      // Add Authorization header to every request
      config.headers.Authorization = `Bearer ${token}`
    }

    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ Request error:', error)
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = tokenStorage.getRefreshToken()

      if (refreshToken) {
        try {
          console.log('🔄 Attempting token refresh...')

          const refreshResponse = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            {
              refreshToken,
            },
            {
              headers: {
                Authorization: `Bearer ${tokenStorage.getAccessToken()}`,
              },
            },
          )

          const { accessToken, refreshToken: newRefreshToken } =
            refreshResponse.data

          tokenStorage.setTokens(accessToken, newRefreshToken)

          originalRequest.headers.Authorization = `Bearer ${accessToken}`

          console.log('✅ Token refreshed successfully')
          return apiClient(originalRequest)
        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError)

          tokenStorage.clearTokens()

          // TODO: Redirect to login page
          window.location.href = '/login'

          return Promise.reject(refreshError)
        }
      } else {
        // No refresh token available, clear everything
        tokenStorage.clearTokens()
        window.location.href = '/login'
      }
    }

    console.error(
      `❌ API Error: ${error.response?.status} ${error.config?.url}`,
      error.response?.data,
    )
    return Promise.reject(error)
  },
)

export default apiClient
