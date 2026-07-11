import { useState } from 'react'
import './App.css'
import { supabase } from './lib/supabase'
import { AuthProvider, useAuth } from './context/AuthContext'
import { WeekProvider } from './context/WeekContext'
import Dashboard from './pages/Dashboard'

type PageType = 'dashboard' | 'taskwheel' | 'selfcare' | 'connection' | 'datenighthosting' | 'nightlyclosing' | 'openloops'

function App() {
  return (
    <AuthProvider>
      <WeekProvider>
        <AppContent />
      </WeekProvider>
    </AuthProvider>
  )
}

function AppContent() {
  const { user, loading, signOut } = useAuth()
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-amber-900">Loading...</h1>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <nav className="bg-white shadow-sm border-b border-amber-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="text-2xl font-bold text-amber-900 hover:text-orange-600 transition"
          >
            💑 Ruby & James
          </button>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main>
        <Dashboard currentPage={currentPage} onNavigate={setCurrentPage} />
      </main>
    </div>
  )
}

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-amber-100">
        <h1 className="text-3xl font-bold text-center text-amber-900 mb-2">Ruby & James</h1>
        <p className="text-center text-gray-600 mb-8">Weekly Check-in</p>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium py-2 rounded-lg hover:from-orange-600 hover:to-amber-600 transition disabled:opacity-50"
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-orange-500 font-medium hover:text-orange-600"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default App
