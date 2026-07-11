// Input validation utilities

export const validation = {
  email: (email: string): string | null => {
    if (!email) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format'
    return null
  },

  password: (password: string): string | null => {
    if (!password) return 'Password is required'
    if (password.length < 3) return 'Password must be at least 3 characters'
    return null
  },

  taskTitle: (title: string): string | null => {
    if (!title || !title.trim()) return 'Task title is required'
    if (title.length > 200) return 'Task title too long (max 200 characters)'
    return null
  },

  activityName: (name: string): string | null => {
    if (!name || !name.trim()) return 'Activity name is required'
    if (name.length > 100) return 'Activity name too long (max 100 characters)'
    return null
  },

  loopTitle: (title: string): string | null => {
    if (!title || !title.trim()) return 'Loop title is required'
    if (title.length > 200) return 'Loop title too long (max 200 characters)'
    return null
  },

  date: (dateStr: string): string | null => {
    if (!dateStr) return 'Date is required'
    const date = new Date(dateStr + 'T00:00:00')
    if (isNaN(date.getTime())) return 'Invalid date'
    return null
  },

  text: (text: string, maxLength = 1000): string | null => {
    if (text.length > maxLength) return `Text too long (max ${maxLength} characters)`
    return null
  },

  sanitize: (input: string): string => {
    return input
      .replace(/[<>]/g, '')
      .trim()
  },
}

// Toast notification system
let toastCallback: ((message: string, type: 'success' | 'error' | 'info') => void) | null = null

export function setToastHandler(handler: (message: string, type: 'success' | 'error' | 'info') => void) {
  toastCallback = handler
}

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  if (toastCallback) {
    toastCallback(message, type)
  }
}
