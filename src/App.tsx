import { useState } from 'react'
import './App.css'
import { supabase } from './lib/supabase'
import { AuthProvider, useAuth } from './context/AuthContext'
import { WeekProvider } from './context/WeekContext'
import Dashboard from './pages/Dashboard'
import Toast from './components/Toast'

type PageType = 'dashboard' | 'taskwheel' | 'selfcare' | 'connection' | 'datenighthosting' | 'nightlyclosing' | 'openloops'

function App() {
  return (
    <AuthProvider>
      <WeekProvider>
        <AppContent />
      </WeekProvider>
      <Toast />
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Demo credentials: ruby@localhost or james@localhost
      if ((email === 'ruby@localhost' || email === 'james@localhost') && password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        setError('Use ruby@localhost or james@localhost with any password')
        setLoading(false)
        return
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-amber-100">
        <h1 className="text-3xl font-bold text-center text-amber-900 mb-2">💑 Ruby & James</h1>
        <p className="text-center text-gray-600 mb-8">Weekly Check-in</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="ruby@localhost or james@localhost"
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
              placeholder="Any password"
              required
            />
          </div>

          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium py-2 rounded-lg hover:from-orange-600 hover:to-amber-600 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-900 font-medium mb-2">🖥️ Local Demo Mode</p>
          <p className="text-xs text-blue-800">
            <strong>Email:</strong> ruby@localhost or james@localhost<br />
            <strong>Password:</strong> any password<br />
            <strong>Note:</strong> This app runs locally. No internet needed.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
