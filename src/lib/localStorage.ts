// Local storage wrapper for offline/localhost functionality
// Mimics Supabase API for easy component integration

interface StorageData {
  tasks: any[]
  weeklyPlans: any[]
  nightlyChecklist: any[]
  openLoops: any[]
  authSession: any
}

const STORAGE_KEY = 'rubyssurprise_data'

function getStorage(): StorageData {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    const defaults: StorageData = {
      tasks: [],
      weeklyPlans: [],
      nightlyChecklist: [],
      openLoops: [],
      authSession: null,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
    return defaults
  }
  return JSON.parse(stored)
}

function saveStorage(data: StorageData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export const localDb = {
  // Tasks operations
  tasks: {
    async select() {
      const data = getStorage()
      return { data: data.tasks, error: null }
    },
    async insert(records: any[]) {
      const data = getStorage()
      const newRecords = records.map(r => ({
        ...r,
        id: r.id || generateId(),
        created_at: r.created_at || new Date().toISOString(),
      }))
      data.tasks = [...data.tasks, ...newRecords]
      saveStorage(data)
      return { data: newRecords, error: null }
    },
    async update(record: any, id: string) {
      const data = getStorage()
      data.tasks = data.tasks.map(t => t.id === id ? { ...t, ...record } : t)
      saveStorage(data)
      return { error: null }
    },
    async delete(id: string) {
      const data = getStorage()
      data.tasks = data.tasks.filter(t => t.id !== id)
      saveStorage(data)
      return { error: null }
    },
  },

  // Weekly plans operations
  weeklyPlans: {
    async select() {
      const data = getStorage()
      return { data: data.weeklyPlans, error: null }
    },
    async insert(records: any[]) {
      const data = getStorage()
      const newRecords = records.map(r => ({
        ...r,
        id: r.id || generateId(),
        created_at: r.created_at || new Date().toISOString(),
      }))
      data.weeklyPlans = [...data.weeklyPlans, ...newRecords]
      saveStorage(data)
      return { data: newRecords, error: null }
    },
    async update(record: any, id: string) {
      const data = getStorage()
      data.weeklyPlans = data.weeklyPlans.map(w => w.id === id ? { ...w, ...record } : w)
      saveStorage(data)
      return { error: null }
    },
  },

  // Nightly checklist operations
  nightlyChecklist: {
    async select() {
      const data = getStorage()
      return { data: data.nightlyChecklist, error: null }
    },
    async insert(records: any[]) {
      const data = getStorage()
      const newRecords = records.map(r => ({
        ...r,
        id: r.id || generateId(),
        created_at: r.created_at || new Date().toISOString(),
      }))
      data.nightlyChecklist = [...data.nightlyChecklist, ...newRecords]
      saveStorage(data)
      return { data: newRecords, error: null }
    },
    async update(record: any, id: string) {
      const data = getStorage()
      data.nightlyChecklist = data.nightlyChecklist.map(n => n.id === id ? { ...n, ...record } : n)
      saveStorage(data)
      return { error: null }
    },
  },

  // Open loops operations
  openLoops: {
    async select() {
      const data = getStorage()
      return { data: data.openLoops, error: null }
    },
    async insert(records: any[]) {
      const data = getStorage()
      const newRecords = records.map(r => ({
        ...r,
        id: r.id || generateId(),
        created_at: r.created_at || new Date().toISOString(),
      }))
      data.openLoops = [...data.openLoops, ...newRecords]
      saveStorage(data)
      return { data: newRecords, error: null }
    },
    async update(record: any, id: string) {
      const data = getStorage()
      data.openLoops = data.openLoops.map(o => o.id === id ? { ...o, ...record } : o)
      saveStorage(data)
      return { error: null }
    },
    async delete(id: string) {
      const data = getStorage()
      data.openLoops = data.openLoops.filter(o => o.id !== id)
      saveStorage(data)
      return { error: null }
    },
  },

  // Auth operations
  auth: {
    async signUp({ email, password }: { email: string; password: string }) {
      const data = getStorage()
      data.authSession = {
        user: { id: generateId(), email, user_metadata: {} },
        session: { access_token: generateId() },
      }
      saveStorage(data)
      return { error: null }
    },
    async signInWithPassword({ email, password }: { email: string; password: string }) {
      const data = getStorage()
      // Demo: accept ruby@localhost and james@localhost
      if ((email === 'ruby@localhost' || email === 'james@localhost') && password) {
        data.authSession = {
          user: { id: generateId(), email, user_metadata: {} },
          session: { access_token: generateId() },
        }
        saveStorage(data)
        return { error: null }
      }
      return { error: new Error('Invalid credentials. Use ruby@localhost or james@localhost with any password.') }
    },
    async getSession() {
      const data = getStorage()
      return { data: { session: data.authSession?.session ? { user: data.authSession.user } : null }, error: null }
    },
    async signOut() {
      const data = getStorage()
      data.authSession = null
      saveStorage(data)
      return { error: null }
    },
    onAuthStateChange(callback: (event: string, session: any) => void) {
      const data = getStorage()
      callback('INITIAL_SESSION', data.authSession?.session ? { user: data.authSession.user } : null)
      return { data: { subscription: { unsubscribe: () => {} } } }
    },
  },

  // Utility: Clear all data (for testing)
  clearAll() {
    localStorage.removeItem(STORAGE_KEY)
  },

  // Utility: Export data
  exportData() {
    return getStorage()
  },
}
