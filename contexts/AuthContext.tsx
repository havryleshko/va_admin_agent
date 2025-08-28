'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, AuthState, AuthContextType, LoginCredentials } from '@/types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  })

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const userData = localStorage.getItem('user_data')
      
      if (token && userData) {
        const user = JSON.parse(userData)
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true
        })
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false
        })
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false
      })
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      // Simulate Gmail OAuth login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const { user, token } = await response.json()
      
      // Store auth data
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user_data', JSON.stringify(user))
      
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true
      })
    } catch (error) {
      console.error('Login error:', error)
      setAuthState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const logout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const refreshToken = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const { user, token: newToken } = await response.json()
        localStorage.setItem('auth_token', newToken)
        localStorage.setItem('user_data', JSON.stringify(user))
        
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true
        })
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      await logout()
    }
  }

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    refreshToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
