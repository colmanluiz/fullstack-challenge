import { tokenStorage } from '@/lib/api'
import { authApi } from '@/services/authApi'
import {
  type User,
  type AuthActions,
  type AuthState,
  type LoginRequest,
  type RegisterRequest,
} from '@/types/auth'
import { toast } from 'sonner'
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

const AuthContext = createContext<(AuthState & AuthActions) | undefined>(
  undefined,
)

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = tokenStorage.getAccessToken()
      const refreshToken = tokenStorage.getRefreshToken()

      if (accessToken && refreshToken) {
        try {
          console.log('🔍 Found existing tokens, checking authentication...')

          // Get current user data from the backend
          const userData = await authApi.getCurrentUser()
          setUser(userData)
          setIsAuthenticated(true)

          console.log('✅ User authenticated successfully:', userData.username)
        } catch (error) {
          console.error('❌ Token validation failed:', error)
          tokenStorage.clearTokens()
          setIsAuthenticated(false)
          setUser(null)
        }
      }

      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true)

      const response = await authApi.login(credentials)

      tokenStorage.setTokens(response.accessToken, response.refreshToken)

      setUser(response.user)
      setIsAuthenticated(true)

      toast.success(`Welcome back, ${response.user.username}!`)
    } catch (error) {
      console.error('Login failed:', error)
      toast.error('Login failed. Please check your credentials.')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true)

      const response = await authApi.register(data)

      tokenStorage.setTokens(response.accessToken, response.refreshToken)

      setUser(response.user)
      setIsAuthenticated(true)

      toast.success(`Welcome to the app, ${response.user.username}!`)
    } catch (error) {
      console.error('Registration failed:', error)
      toast.error('Registration failed. Please try again.')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      const refreshToken = tokenStorage.getRefreshToken()

      if (refreshToken) {
        await authApi.logout(refreshToken)
      }
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      tokenStorage.clearTokens()
      setUser(null)
      setIsAuthenticated(false)

      toast.success('Logged out successfully')
    }
  }

  const refreshToken = async (): Promise<void> => {
    const currentRefreshToken = tokenStorage.getRefreshToken()

    if (!currentRefreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await authApi.refreshToken({
        refreshToken: currentRefreshToken,
      })

      tokenStorage.setTokens(response.accessToken, response.refreshToken)
      setUser(response.user)
      setIsAuthenticated(true)

      console.log('token refreshed successfully')
    } catch (error) {
      console.error('token refresh failed: ', error)

      tokenStorage.clearTokens()
      setUser(null)
      setIsAuthenticated(false)

      throw error
    }
  }

  const value = {
    // state
    user,
    isAuthenticated,
    isLoading,

    // actions
    login,
    register,
    logout,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
