import { useState, useEffect } from 'react'
import { User, DAYS_OF_WEEK } from '../types'
import { supabase } from '../lib/supabase'
import './SelfCareForm.css'

interface SelfCareFormProps {
  weekStart: string
  parent: User
  otherParent: User
}

export default function SelfCareForm({ weekStart, parent, otherParent }: SelfCareFormProps) {
  const [activity, setActivity] = useState('')
  const [night, setNight] = useState('')
  const [otherActivity, setOtherActivity] = useState('')
  const [otherNight, setOtherNight] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSelfCare()
  }, [weekStart])

  const loadSelfCare = async () => {
    // In a real app, fetch from database
    // For now, just initialize empty
  }

  const saveSelfCare = async () => {
    if (!activity || !night) {
      alert('Please fill in both activity and night')
      return
    }

    setLoading(true)

    try {
      // TODO: Save to database
      // await supabase.from('weekly_plans').upsert(...)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Your Self-Care */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-indigo-100">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">
            🧘 Your Screen-Free Time
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity ({parent}):
            </label>
            <input
              type="text"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="e.g., yoga, reading, painting..."
              className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Which night?
            </label>
            <select
              value={night}
              onChange={(e) => setNight(e.target.value)}
              className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a night...</option>
              {DAYS_OF_WEEK.map((day) => (
                <option key={day.num} value={day.name}>
                  {day.name}
                </option>
              ))}
            </select>
          </div>

          {night && (
            <div className="bg-indigo-50 rounded-lg p-4 mb-4 border border-indigo-200">
              <p className="text-sm text-indigo-900">
                ✓ {otherParent} will watch Clara on {night}
              </p>
            </div>
          )}

          <button
            onClick={saveSelfCare}
            disabled={loading || !activity || !night}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium py-2 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save My Self-Care'}
          </button>
        </div>

        {/* Partner's Self-Care Info */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">
            💑 {otherParent === 'ruby' ? 'Ruby' : 'James'}'s Screen-Free Time
          </h2>

          {otherActivity && otherNight ? (
            <>
              <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600">Activity:</p>
                <p className="text-lg font-bold text-purple-900">{otherActivity}</p>
              </div>

              <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600">Night:</p>
                <p className="text-lg font-bold text-purple-900">{otherNight}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-green-900">
                  ✓ You're watching Clara on {otherNight}
                </p>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Waiting for {otherParent === 'ruby' ? 'Ruby' : 'James'} to set their self-care...
            </p>
          )}
        </div>
      </div>

      {/* Calendar View */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-indigo-100">
        <h3 className="text-xl font-bold text-indigo-900 mb-4">Weekly Schedule</h3>

        <div className="grid grid-cols-7 gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day.num}
              className={`p-4 rounded-lg text-center border-2 transition ${
                night === day.name
                  ? 'bg-indigo-100 border-indigo-500'
                  : otherNight === day.name
                    ? 'bg-purple-100 border-purple-500'
                    : 'bg-gray-50 border-gray-200'
              }`}
            >
              <p className="text-sm font-medium text-gray-700">{day.short}</p>
              {night === day.name && (
                <p className="text-xs text-indigo-900 mt-2 font-bold">Your Time</p>
              )}
              {otherNight === day.name && (
                <p className="text-xs text-purple-900 mt-2 font-bold">Their Time</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
