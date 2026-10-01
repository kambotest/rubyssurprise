import { useState, useRef } from 'react'
import { Download, Upload } from 'lucide-react'
import './App.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import { WeekProvider } from './context/WeekContext'
import Dashboard from './pages/Dashboard'
import Toast from './components/Toast'
import { User } from './types'
import { exportBackup, importBackup } from './lib/backup'
import { showToast } from './lib/validation'

type PageType = 'dashboard' | 'taskwheel' | 'selfcare' | 'connection' | 'datenighthosting' | 'openloops'

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
  const importInputRef = useRef<HTMLInputElement>(null)

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      await importBackup(file)
      showToast('Backup restored — reloading…', 'success')
      setTimeout(() => window.location.reload(), 800)
    } catch {
      showToast('Could not read that backup file', 'error')
    }
  }

  if (loading) {
    return (
      <div className="app-loading">
        <span className="eyebrow">Ruby &amp; James</span>
      </div>
    )
  }

  if (!parent) {
    return <ParentSelector onSelectParent={setParent} />
  }

  return (
    <div className="page">
      <header className="masthead">
        <div className="masthead__inner">
          <button className="wordmark" onClick={() => setCurrentPage('dashboard')}>
            <span className="wordmark__name">Ruby &amp; James</span>
            <span className="wordmark__tag">Atelier</span>
          </button>
          <div className="masthead__actions">
            <span className="identity">
              <span className="identity__dot" />
              {parent === 'ruby' ? 'Ruby' : 'James'}
            </span>
            <button
              className="btn-icon"
              onClick={() => exportBackup()}
              title="Download a backup of all entered data"
              aria-label="Export backup"
            >
              <Download />
            </button>
            <button
              className="btn-icon"
              onClick={() => importInputRef.current?.click()}
              title="Restore data from a backup file"
              aria-label="Import backup"
            >
              <Upload />
            </button>
            <input
              ref={importInputRef}
              type="file"
              accept="application/json"
              onChange={handleImportFile}
              style={{ display: 'none' }}
            />
            <button className="btn btn--ghost btn--sm" onClick={() => setParent(null)}>
              Switch
            </button>
          </div>
        </div>
      </header>

      <main>
        <Dashboard currentPage={currentPage} onNavigate={setCurrentPage} />
      </main>
    </div>
  )
}

function ParentSelector({ onSelectParent }: { onSelectParent: (parent: User) => void }) {
  return (
    <div className="selector">
      <div className="selector__inner">
        <span className="eyebrow">Weekly Check-In</span>
        <h1 className="display display--xl selector__title">Ruby &amp; James</h1>
        <p className="lede selector__lede">
          A private space to keep the week in order. Choose your name to continue.
        </p>

        <div className="selector__grid">
          <button className="portal" onClick={() => onSelectParent('ruby')}>
            <span className="portal__initial">R</span>
            <span className="portal__name">Ruby</span>
            <span className="portal__enter">Enter</span>
          </button>
          <button className="portal" onClick={() => onSelectParent('james')}>
            <span className="portal__initial">J</span>
            <span className="portal__name">James</span>
            <span className="portal__enter">Enter</span>
          </button>
        </div>

        <p className="selector__note">No password required — your choice is remembered on this device.</p>
      </div>
    </div>
  )
}

export default App
