import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { User, DAYS_OF_WEEK } from '../types'
import './WeeklySummary.css'

interface SummaryData {
  selectedTask?: { title: string; scheduled_date: string | null }
  selfCare?: Partial<Record<User, { activity: string; night: string }>>
  connectionNight?: { night: string; notes: string }
  dateNightHosting?: {
    type: 'date' | 'hosting'
    night: string
    location?: string
    babysitter?: string
    menu?: string
    guestsList?: string
  }
  taskSwaps?: Array<{ title: string; assignedBy: User; assignedTo: User; completed: boolean }>
  openLoopCount?: number
}

interface WeeklySummaryProps {
  isOpen: boolean
  onClose: () => void
  onEdit: (feature: string) => void
  weekStart: string
}

const parentName = (u: User) => (u === 'ruby' ? 'Ruby' : 'James')

export default function WeeklySummary({ isOpen, onClose, onEdit, weekStart }: WeeklySummaryProps) {
  const [summary, setSummary] = useState<SummaryData>({})

  useEffect(() => {
    if (isOpen) {
      loadSummaryData()
    }
  }, [isOpen, weekStart])

  const loadSummaryData = () => {
    const data: SummaryData = {}

    const appData = JSON.parse(localStorage.getItem('rubyssurprise_data') || '{}')
    const scheduledTask = (appData.tasks || []).find((t: any) => t.scheduled_date)
    if (scheduledTask) {
      data.selectedTask = { title: scheduledTask.title, scheduled_date: scheduledTask.scheduled_date }
    }

    const selfCare = JSON.parse(localStorage.getItem('rubyssurprise_selfcare') || '{}')
    if (selfCare[weekStart]) {
      data.selfCare = selfCare[weekStart]
    }

    const connection = JSON.parse(localStorage.getItem('rubyssurprise_connection') || '{}')
    if (connection[weekStart]) {
      data.connectionNight = connection[weekStart]
    }

    const dateNight = JSON.parse(localStorage.getItem('rubyssurprise_datenighthosting') || '{}')
    if (dateNight[weekStart]) {
      data.dateNightHosting = dateNight[weekStart]
    }

    const taskSwaps = JSON.parse(localStorage.getItem('rubyssurprise_taskswap') || '[]')
    const weekSwaps = taskSwaps.filter((t: any) => t.week === weekStart)
    if (weekSwaps.length > 0) {
      data.taskSwaps = weekSwaps
    }

    const openLoops = (appData.openLoops || []).filter((l: any) => !l.closed_at)
    data.openLoopCount = openLoops.length

    setSummary(data)
  }

  if (!isOpen) return null

  const dayItems: Record<number, { label: string; value: string }[]> = {}
  const addItem = (dayName: string, label: string, value: string) => {
    const day = DAYS_OF_WEEK.find((d) => d.name === dayName)
    if (!day) return
    if (!dayItems[day.num]) dayItems[day.num] = []
    dayItems[day.num].push({ label, value })
  }

  if (summary.selectedTask?.scheduled_date) {
    const day = DAYS_OF_WEEK[new Date(summary.selectedTask.scheduled_date).getDay()]
    if (day) addItem(day.name, 'Task', summary.selectedTask.title)
  }
  if (summary.selfCare) {
    for (const [who, entry] of Object.entries(summary.selfCare)) {
      if (entry?.night) addItem(entry.night, 'Independent Time', `${parentName(who as User)}'s ${entry.activity}`)
    }
  }
  if (summary.connectionNight?.night) {
    addItem(summary.connectionNight.night, 'Connection', 'Quality time together')
  }
  if (summary.dateNightHosting?.night) {
    addItem(
      summary.dateNightHosting.night,
      summary.dateNightHosting.type === 'date' ? 'Date Night' : 'Hosting',
      summary.dateNightHosting.type === 'date'
        ? summary.dateNightHosting.location || 'Evening out'
        : 'Guests at home'
    )
  }

  const hasAnyDayItems = Object.keys(dayItems).length > 0
  const hasAnyCommitments =
    summary.selectedTask ||
    summary.taskSwaps?.length ||
    summary.connectionNight ||
    summary.dateNightHosting ||
    (summary.openLoopCount ?? 0) > 0

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
            {hasAnyDayItems ? (
              <div className="week-breakdown">
                {DAYS_OF_WEEK.filter((day) => dayItems[day.num]).map((day) => (
                  <div key={day.num} className="day-card">
                    <span className="day-card__name">{day.name}</span>
                    <div className="day-card__items">
                      {dayItems[day.num].map((item, i) => (
                        <div key={i} className="day-item">
                          <span className="day-item__label">{item.label}</span>
                          <span className="day-item__value">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty">Nothing scheduled to a specific day yet.</p>
            )}
          </div>

          {/* Commitments summary */}
          <div className="summary-section">
            <h3 className="eyebrow">Commitments</h3>
            {hasAnyCommitments ? (
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
                    <span className="commitment__value">{summary.taskSwaps.length} task{summary.taskSwaps.length > 1 ? 's' : ''}</span>
                  </div>
                )}
                {summary.connectionNight && (
                  <div className="commitment">
                    <span className="commitment__label">Connection Night</span>
                    <span className="commitment__value">{summary.connectionNight.night}</span>
                  </div>
                )}
                {summary.dateNightHosting && (
                  <div className="commitment">
                    <span className="commitment__label">
                      {summary.dateNightHosting.type === 'date' ? 'Date Night' : 'Hosting'}
                    </span>
                    <span className="commitment__value">{summary.dateNightHosting.night}</span>
                  </div>
                )}
                {(summary.openLoopCount ?? 0) > 0 && (
                  <div className="commitment">
                    <span className="commitment__label">Open Loops</span>
                    <span className="commitment__value">{summary.openLoopCount} being tracked</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="empty">Nothing entered yet.</p>
            )}
          </div>

          {/* Quick edit links */}
          <div className="summary-section">
            <h3 className="eyebrow">Need to adjust?</h3>
            <div className="edit-links">
              <button onClick={() => onEdit('taskwheel')} className="edit-link">← Task Wheel</button>
              <button onClick={() => onEdit('selfcare')} className="edit-link">← Independent Free Time</button>
              <button onClick={() => onEdit('connection')} className="edit-link">← Connection Night</button>
              <button onClick={() => onEdit('datenighthosting')} className="edit-link">← Date Night / Hosting</button>
              <button onClick={() => onEdit('taskswap')} className="edit-link">← Task Swap</button>
              <button onClick={() => onEdit('openloops')} className="edit-link">← Open Loops</button>
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
