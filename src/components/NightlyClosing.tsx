import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { User, DAYS_OF_WEEK, NightlyChecklist } from '../types'
import { supabase } from '../lib/supabase'
import { getDateString, addDays } from '../lib/utils'
import { showToast } from '../lib/validation'
import './NightlyClosing.css'

interface NightlyClosingProps {
  weekStart: Date
  currentUser: User
}

type Field = 'exercise' | 'house_reset' | 'supplements' | 'hydration'

const RITUALS: { field: Field; title: string; desc: string }[] = [
  { field: 'exercise', title: 'Movement', desc: 'A walk, a workout — anything that moves the body.' },
  { field: 'house_reset', title: 'House Reset', desc: 'Tidy the surfaces; set tomorrow up gently.' },
  { field: 'supplements', title: 'Creatine & Fish Oil', desc: 'The small, daily upkeep.' },
  { field: 'hydration', title: 'Hydration', desc: 'A last glass of water before the day closes.' },
]

export default function NightlyClosing({ weekStart, currentUser }: NightlyClosingProps) {
  const [checklist, setChecklist] = useState<Record<string, NightlyChecklist | null>>({})
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(getDateString(weekStart))

  useEffect(() => {
    loadWeeklyChecklist()
  }, [])

  const loadWeeklyChecklist = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('nightly_checklist')
      .select('*')
      .eq('user', currentUser)
      .gte('date', getDateString(weekStart))
      .lte('date', getDateString(addDays(weekStart, 6)))

    if (!error && data) {
      const checklistMap: Record<string, NightlyChecklist> = {}
      data.forEach((item: NightlyChecklist) => {
        checklistMap[item.date] = item
      })
      setChecklist(checklistMap)
    }
    setLoading(false)
  }

  const getOrCreateChecklist = async (date: string): Promise<NightlyChecklist> => {
    if (checklist[date]) {
      return checklist[date]!
    }

    const { data, error } = await supabase
      .from('nightly_checklist')
      .insert([
        {
          user: currentUser,
          date,
          exercise: false,
          house_reset: false,
          supplements: false,
          hydration: false,
        },
      ])
      .select()
      .single()

    if (!error && data) {
      return data
    }
    throw new Error('Failed to create checklist')
  }

  const updateChecklist = async (date: string, field: Field, value: boolean) => {
    let item = checklist[date]
    if (!item) {
      item = await getOrCreateChecklist(date)
    }

    const { error } = await supabase
      .from('nightly_checklist')
      .update({ [field]: value })
      .eq('id', item.id)

    if (error) {
      showToast('Could not update', 'error')
    } else {
      setChecklist({ ...checklist, [date]: { ...item, [field]: value } })
    }
  }

  const getCurrentItem = () => checklist[selectedDate]

  const getCompletionPercentage = () => {
    const days = []
    for (let i = 0; i < 7; i++) {
      days.push(getDateString(addDays(weekStart, i)))
    }
    const completed = days.filter((date) => {
      const item = checklist[date]
      if (!item) return false
      return item.exercise && item.house_reset && item.supplements && item.hydration
    })
    return Math.round((completed.length / days.length) * 100)
  }

  if (loading) {
    return <div className="empty">Loading…</div>
  }

  const currentItem = getCurrentItem()
  const pct = getCompletionPercentage()
  const allDone = currentItem && currentItem.exercise && currentItem.house_reset &&
    currentItem.supplements && currentItem.hydration

  const dayName = DAYS_OF_WEEK.find((d) => {
    const date = new Date(selectedDate + 'T00:00:00')
    return d.num === (date.getDay() || 7)
  })?.name || 'Today'

  return (
    <div>
      <div className="section-head">
        <span className="eyebrow">No. 05</span>
        <h2 className="display display--lg">The Closing Shift</h2>
        <p className="lede">Four small rituals to close each day well, kept as a quiet weekly rhythm.</p>
      </div>

      {/* Progress */}
      <div className="card closing-progress">
        <div>
          <p className="stat__label">This Week Complete</p>
          <p className="closing-progress__value">{pct}<span>%</span></p>
        </div>
        <div
          className="progress-ring"
          style={{ background: `conic-gradient(var(--accent) ${pct * 3.6}deg, var(--line) 0deg)` }}
        >
          <span className="progress-ring__center">{pct}%</span>
        </div>
      </div>

      {/* Day selection */}
      <div className="card mt-6">
        <label className="label">Select a day</label>
        <div className="choice-grid choice-grid--7">
          {Array.from({ length: 7 }).map((_, i) => {
            const date = getDateString(addDays(weekStart, i))
            const day = DAYS_OF_WEEK[i]
            const isSelected = date === selectedDate
            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`choice ${isSelected ? 'choice--active' : ''}`}
              >
                {day.short}
                <span className="choice__sub">{date.split('-')[2]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Rituals */}
      <div className="card mt-6">
        <h3 className="card-title">{dayName}&rsquo;s Rituals</h3>
        <div className="stack-md">
          {RITUALS.map((ritual) => {
            const checked = currentItem?.[ritual.field] || false
            return (
              <label key={ritual.field} className={`check-row ${checked ? 'check-row--done' : ''}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => updateChecklist(selectedDate, ritual.field, e.target.checked)}
                />
                <span className="check-box"><Check /></span>
                <span>
                  <span className="check-row__title">{ritual.title}</span>
                  <span className="check-row__desc">{ritual.desc}</span>
                </span>
              </label>
            )
          })}
        </div>

        {allDone && (
          <div className="panel panel--positive mt-6">Every ritual complete. A day well closed.</div>
        )}
      </div>
    </div>
  )
}
