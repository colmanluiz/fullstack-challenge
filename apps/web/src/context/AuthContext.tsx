import { tokenStorage } from '@/lib/api'
import { authApi } from '@/services/authApi'
import {
  type User,
  type AuthActions,
  type AuthState,
  type LoginRequest,
  type RegisterRequest,
} from '@/types/auth'
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
          // for now, only assume if tokens exist, the user is logged in
          console.log('found existing tokens, user is logged in')

          setIsAuthenticated(true)
        } catch (error) {
          console.error('token validation failed', error)
          tokenStorage.clearTokens()
        }
      }

      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true)
      console.log('attempting login..')

      const response = await authApi.login(credentials)

      tokenStorage.setTokens(response.accessToken, response.refreshToken)

      setUser(response.user)
      setIsAuthenticated(true)

      console.log('login successful', response.user.username)
    } catch (error) {
      console.error('login failed: ', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true)
      console.log('attempting registration..')

      const response = await authApi.register(data)

      tokenStorage.setTokens(response.accessToken, response.refreshToken)

      setUser(response.user)
      setIsAuthenticated(true)

      console.log('registration successful', response.user.username)
    } catch (error) {
      console.error('registration failed: ', error)
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
      console.error('logout failed: ', error)
    } finally {
      tokenStorage.clearTokens()
      setUser(null)
      setIsAuthenticated(false)

      console.log('user logged out')
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
