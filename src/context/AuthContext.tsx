import { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { User } from '../types'

interface AuthContextType {
  user: SupabaseUser | null
  parent: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [parent, setParent] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      determineParent(session?.user?.email)
    })
    return () => subscription?.unsubscribe()
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user ?? null)
    determineParent(session?.user?.email)
    setLoading(false)
  }

  const determineParent = (email?: string) => {
    if (!email) {
      setParent(null)
      return
    }
    if (email.toLowerCase().includes('ruby')) {
      setParent('ruby')
    } else if (email.toLowerCase().includes('james')) {
      setParent('james')
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setParent(null)
  }

  return (
    <AuthContext.Provider value={{ user, parent, loading, signOut }}>
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
