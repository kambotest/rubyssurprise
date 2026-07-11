import { useState, useEffect } from 'react'
import { User, DAYS_OF_WEEK, NightlyChecklist } from '../types'
import { supabase } from '../lib/supabase'
import { getDateString, addDays } from '../lib/utils'
import './NightlyClosing.css'

interface NightlyClosingProps {
  weekStart: Date
  currentUser: User
}

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

  const updateChecklist = async (
    date: string,
    field: 'exercise' | 'house_reset' | 'supplements' | 'hydration',
    value: boolean
  ) => {
    let item = checklist[date]

    if (!item) {
      item = await getOrCreateChecklist(date)
    }

    const { error } = await supabase
      .from('nightly_checklist')
      .update({ [field]: value })
      .eq('id', item.id)

    if (!error) {
      setChecklist({
        ...checklist,
        [date]: { ...item, [field]: value },
      })
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
    return <div className="text-center py-8">Loading checklist...</div>
  }

  const currentItem = getCurrentItem()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-blue-900 mb-2">✅ Nightly Closing Shift</h2>
        <p className="text-gray-600">Daily rituals to end your day strong</p>
      </div>

      {/* Completion Stats */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Weekly Completion</p>
            <p className="text-4xl font-bold text-blue-900">{getCompletionPercentage()}%</p>
          </div>
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="w-20 h-20"
              style={{
                background: `conic-gradient(rgb(59, 130, 246) ${getCompletionPercentage()}%, rgb(229, 231, 235) ${getCompletionPercentage()}%)`,
                borderRadius: '50%',
              }}
            >
              <circle cx="50" cy="50" r="35" fill="white" />
            </svg>
          </div>
        </div>
      </div>

      {/* Day Selection */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100 mb-6">
        <h3 className="text-lg font-bold text-blue-900 mb-4">Select Date</h3>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => {
            const date = getDateString(addDays(weekStart, i))
            const day = DAYS_OF_WEEK[i]
            const isSelected = date === selectedDate

            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`p-3 rounded-lg border-2 transition font-medium ${
                  isSelected
                    ? 'bg-blue-100 border-blue-500 text-blue-900'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-blue-300'
                }`}
              >
                <p className="text-sm">{day.short}</p>
                <p className="text-xs text-gray-500 mt-1">{date.split('-')[2]}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Checklist Items */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
        <h3 className="text-xl font-bold text-blue-900 mb-6">
          {DAYS_OF_WEEK.find((d) => {
            const date = new Date(selectedDate + 'T00:00:00')
            return d.num === (date.getDay() || 7)
          })?.name || 'Today'}'s Rituals
        </h3>

        <div className="space-y-4">
          {/* Exercise */}
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 hover:shadow-md transition">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={currentItem?.exercise || false}
                onChange={(e) => updateChecklist(selectedDate, 'exercise', e.target.checked)}
                className="w-6 h-6 text-blue-600 rounded cursor-pointer"
              />
              <span className="ml-3 text-lg font-medium text-blue-900">🏃 Exercise / Movement</span>
            </label>
            <p className="text-sm text-gray-600 ml-9">Get your body moving</p>
          </div>

          {/* House Reset */}
          <div className="p-4 rounded-lg bg-green-50 border border-green-200 hover:shadow-md transition">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={currentItem?.house_reset || false}
                onChange={(e) => updateChecklist(selectedDate, 'house_reset', e.target.checked)}
                className="w-6 h-6 text-green-600 rounded cursor-pointer"
              />
              <span className="ml-3 text-lg font-medium text-green-900">🏠 House Reset</span>
            </label>
            <p className="text-sm text-gray-600 ml-9">Tidy up and prepare for tomorrow</p>
          </div>

          {/* Supplements */}
          <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 hover:shadow-md transition">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={currentItem?.supplements || false}
                onChange={(e) => updateChecklist(selectedDate, 'supplements', e.target.checked)}
                className="w-6 h-6 text-purple-600 rounded cursor-pointer"
              />
              <span className="ml-3 text-lg font-medium text-purple-900">💊 Creatine & Fish Oil</span>
            </label>
            <p className="text-sm text-gray-600 ml-9">Take your supplements</p>
          </div>

          {/* Hydration */}
          <div className="p-4 rounded-lg bg-cyan-50 border border-cyan-200 hover:shadow-md transition">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={currentItem?.hydration || false}
                onChange={(e) => updateChecklist(selectedDate, 'hydration', e.target.checked)}
                className="w-6 h-6 text-cyan-600 rounded cursor-pointer"
              />
              <span className="ml-3 text-lg font-medium text-cyan-900">💧 Hydration</span>
            </label>
            <p className="text-sm text-gray-600 ml-9">Drink plenty of water</p>
          </div>
        </div>

        {/* Completion Indicator */}
        {currentItem && currentItem.exercise && currentItem.house_reset &&
         currentItem.supplements && currentItem.hydration && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-2 border-green-400">
            <p className="text-center text-green-900 font-bold">🎉 Great job! All rituals complete for today!</p>
          </div>
        )}
      </div>
    </div>
  )
}
