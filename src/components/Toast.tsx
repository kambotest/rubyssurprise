import { useState, useEffect } from 'react'
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

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[toast.type]

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  }[toast.type]

  return (
    <div className={`toast-container ${bgColor}`}>
      <span className="text-white font-medium">
        {icon} {toast.message}
      </span>
    </div>
  )
}
