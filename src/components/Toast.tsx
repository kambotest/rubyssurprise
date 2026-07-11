import { useState, useEffect } from 'react'
import { Check, X, Info } from 'lucide-react'
import { setToastHandler } from '../lib/validation'
import './Toast.css'

export default function Toast() {
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
  } | null>(null)

  useEffect(() => {
    setToastHandler((message, type) => {
      setToast({ message, type })
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    })
  }, [])

  if (!toast) return null

  const Icon = { success: Check, error: X, info: Info }[toast.type]

  return (
    <div className={`toast toast--${toast.type}`}>
      <span className="toast__icon"><Icon /></span>
      <span className="toast__message">{toast.message}</span>
    </div>
  )
}
