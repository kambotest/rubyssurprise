import { useState } from 'react'
import './App.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import { WeekProvider } from './context/WeekContext'
import Dashboard from './pages/Dashboard'
import Toast from './components/Toast'
import { User } from './types'

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
  const { parent, loading, setParent } = useAuth()
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

  if (!parent) {
    return <ParentSelector onSelectParent={setParent} />
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
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              👤 {parent === 'ruby' ? 'Ruby' : 'James'}
            </span>
            <button
              onClick={() => setParent(null)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm"
            >
              Switch Parent
            </button>
          </div>
        </div>
      </nav>

      <main>
        <Dashboard currentPage={currentPage} onNavigate={setCurrentPage} />
      </main>
    </div>
  )
}

function ParentSelector({ onSelectParent }: { onSelectParent: (parent: User) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-amber-100 text-center">
        <h1 className="text-3xl font-bold text-amber-900 mb-2">💑 Ruby & James</h1>
        <p className="text-gray-600 mb-8">Weekly Check-in</p>
        <p className="text-sm text-gray-500 mb-8">Who are you?</p>

        <div className="flex gap-4">
          <button
            onClick={() => onSelectParent('ruby')}
            className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-4 rounded-xl hover:from-pink-600 hover:to-rose-600 transition transform hover:scale-105"
          >
            <div className="text-2xl mb-2">💎</div>
            <div>Ruby</div>
          </button>
          <button
            onClick={() => onSelectParent('james')}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-4 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition transform hover:scale-105"
          >
            <div className="text-2xl mb-2">🎯</div>
            <div>James</div>
          </button>
        </div>

        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs text-green-900">
            ✓ No login required — just open this page on your phone and select your name!
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
