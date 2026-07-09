import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type UserRole = 'farmer' | 'owner' | 'supplier' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  avatar?: string
  location?: string
  createdAt?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('km_token')
    const savedUser = localStorage.getItem('km_user')
    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('km_token')
        localStorage.removeItem('km_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User, tokenData: string) => {
    setUser(userData)
    setToken(tokenData)
    localStorage.setItem('km_token', tokenData)
    localStorage.setItem('km_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('km_token')
    localStorage.removeItem('km_user')
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates }
      setUser(updated)
      localStorage.setItem('km_user', JSON.stringify(updated))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
