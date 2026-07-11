import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '../types'

interface AuthContextType {
  parent: User | null
  loading: boolean
  setParent: (parent: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [parent, setParentState] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStoredParent()
  }, [])

  const loadStoredParent = () => {
    const stored = localStorage.getItem('rubyssurprise_currentParent')
    if (stored === 'ruby' || stored === 'james') {
      setParentState(stored as User)
    }
    setLoading(false)
  }

  const setParent = (newParent: User | null) => {
    setParentState(newParent)
    if (newParent) {
      localStorage.setItem('rubyssurprise_currentParent', newParent)
    } else {
      localStorage.removeItem('rubyssurprise_currentParent')
    }
  }

  return (
    <AuthContext.Provider value={{ parent, loading, setParent }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
