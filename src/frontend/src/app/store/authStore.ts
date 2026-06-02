import { useState, createContext, useContext, useEffect, ReactNode } from 'react'

interface AuthContextType {
  token: string | null
  isAuthenticated: boolean
  login: (newToken: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwt_token'))
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token)

  useEffect(() => {
    if (token) {
      localStorage.setItem('jwt_token', token)
      setIsAuthenticated(true)
    } else {
      localStorage.removeItem('jwt_token')
      setIsAuthenticated(false)
    }
  }, [token])

  const login = (newToken: string) => {
    setToken(newToken)
  }

  const logout = () => {
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}