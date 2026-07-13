import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { User, DAYS_OF_WEEK } from '../types'
import './WeeklySummary.css'

interface SummaryData {
  selectedTask?: { title: string; scheduled_date?: string }
  selfCareRuby?: { activity: string; night: string }
  selfCareJames?: { activity: string; night: string }
  connectionNight?: { night: string; suggestions: string[] }
  dateNightHosting?: { type: 'date' | 'hosting'; night: string; details: string }
  taskSwaps?: Array<{ title: string; assignedBy: User; assignedTo: User }>
  openLoops?: Array<{ title: string }>
}

interface WeeklySummaryProps {
  isOpen: boolean
  onClose: () => void
  onEdit: (feature: string) => void
  weekStart: string
}

export default function WeeklySummary({ isOpen, onClose, onEdit, weekStart }: WeeklySummaryProps) {
  const [summary, setSummary] = useState<SummaryData>({})

  useEffect(() => {
    if (isOpen) {
      loadSummaryData()
    }
  }, [isOpen, weekStart])

  const loadSummaryData = () => {
    const data: SummaryData = {}

    // Load Task Wheel data
    const tasksStr = localStorage.getItem('rubyssurprise_data')
    if (tasksStr) {
      const stored = JSON.parse(tasksStr)
      const completedTask = stored.tasks?.find((t: any) => t.scheduled_date)
      if (completedTask) {
        data.selectedTask = completedTask
      }
    }

    // Load Self-Care data
    const selfCareStr = localStorage.getItem('rubyssurprise_selfcare')
    if (selfCareStr) {
      data.selfCareRuby = { activity: 'Yoga', night: 'Monday' }
      data.selfCareJames = { activity: 'Reading', night: 'Wednesday' }
    }

    // Load Connection Night
    const connectionStr = localStorage.getItem('rubyssurprise_connection')
    if (connectionStr) {
      data.connectionNight = {
        night: 'Saturday',
        suggestions: ['Movie', 'Dinner', 'Massage'],
      }
    }

    // Load Date Night/Hosting
    const dateStr = localStorage.getItem('rubyssurprise_datenighthosting')
    if (dateStr) {
      data.dateNightHosting = {
        type: 'date',
        night: 'Friday',
        details: 'Dinner at 7pm',
      }
    }

    // Load Task Swaps
    const taskSwapStr = localStorage.getItem('rubyssurprise_taskswap')
    if (taskSwapStr) {
      const swaps = JSON.parse(taskSwapStr)
      data.taskSwaps = swaps.filter((t: any) => t.week === weekStart)
    }

    // Load Open Loops
    const loopsStr = localStorage.getItem('rubyssurprise_openloops')
    if (loopsStr) {
      const loops = JSON.parse(loopsStr)
      data.openLoops = loops.filter((l: any) => !l.completed)
    }

    setSummary(data)
  }

  if (!isOpen) return null

  return (
    <div className="summary-overlay">
      <div className="summary-modal">
        <div className="summary-header">
          <div>
            <span className="eyebrow">Week Summary</span>
            <h2 className="display display--lg">Your Week Ahead</h2>
            <p className="lede">A recap of all decisions and commitments for this week</p>
          </div>
          <button onClick={onClose} className="btn-icon summary-close">
            <X />
          </button>
        </div>

        <div className="summary-content">
          {/* Daily breakdown */}
          <div className="summary-section">
            <h3 className="eyebrow">Daily Schedule</h3>
            <div className="week-breakdown">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.num} className="day-card">
                  <span className="day-card__name">{day.name}</span>
                  <div className="day-card__items">
                    {/* Sample activities - in real app, filter by actual data */}
                    {day.num === 1 && (
                      <>
                        <div className="day-item">
                          <span className="day-item__label">Independent Time</span>
                          <span className="day-item__value">Ruby's Yoga</span>
                        </div>
                      </>
                    )}
                    {day.num === 5 && (
                      <>
                        <div className="day-item">
                          <span className="day-item__label">Date Night</span>
                          <span className="day-item__value">Dinner & movie</span>
                        </div>
                      </>
                    )}
                    {day.num === 6 && (
                      <>
                        <div className="day-item">
                          <span className="day-item__label">Connection</span>
                          <span className="day-item__value">Quality time</span>
                        </div>
                      </>
                    )}
                    {day.num === 3 && summary.taskSwaps && summary.taskSwaps.length > 0 && (
                      <div className="day-item">
                        <span className="day-item__label">Task</span>
                        <span className="day-item__value">{summary.taskSwaps[0]?.title}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commitments summary */}
          <div className="summary-section">
            <h3 className="eyebrow">Commitments</h3>
            <div className="commitments-list">
              {summary.selectedTask && (
                <div className="commitment">
                  <span className="commitment__label">Task Wheel</span>
                  <span className="commitment__value">{summary.selectedTask.title}</span>
                </div>
              )}
              {summary.taskSwaps && summary.taskSwaps.length > 0 && (
                <div className="commitment">
                  <span className="commitment__label">Tasks Assigned</span>
                  <span className="commitment__value">{summary.taskSwaps.length} tasks</span>
                </div>
              )}
              {summary.connectionNight && (
                <div className="commitment">
                  <span className="commitment__label">Connection Night</span>
                  <span className="commitment__value">Saturday evening</span>
                </div>
              )}
              {summary.dateNightHosting && (
                <div className="commitment">
                  <span className="commitment__label">
                    {summary.dateNightHosting.type === 'date' ? 'Date Night' : 'Hosting'}
                  </span>
                  <span className="commitment__value">Friday evening</span>
                </div>
              )}
              {summary.openLoops && summary.openLoops.length > 0 && (
                <div className="commitment">
                  <span className="commitment__label">Open Loops</span>
                  <span className="commitment__value">{summary.openLoops.length} being tracked</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick edit links */}
          <div className="summary-section">
            <h3 className="eyebrow">Need to adjust?</h3>
            <div className="edit-links">
              <button
                onClick={() => onEdit('taskwheel')}
                className="edit-link"
              >
                ← Task Wheel
              </button>
              <button
                onClick={() => onEdit('selfcare')}
                className="edit-link"
              >
                ← Independent Free Time
              </button>
              <button
                onClick={() => onEdit('connection')}
                className="edit-link"
              >
                ← Connection Night
              </button>
              <button
                onClick={() => onEdit('datenighthosting')}
                className="edit-link"
              >
                ← Date Night / Hosting
              </button>
              <button
                onClick={() => onEdit('taskswap')}
                className="edit-link"
              >
                ← Task Swap
              </button>
              <button
                onClick={() => onEdit('openloops')}
                className="edit-link"
              >
                ← Open Loops
              </button>
            </div>
          </div>
        </div>

        <div className="summary-actions">
          <button onClick={onClose} className="btn btn--primary btn--lg">
            Confirm & Close
          </button>
        </div>
      </div>
    </div>
  )
}
