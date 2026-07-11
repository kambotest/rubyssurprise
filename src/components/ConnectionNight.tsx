import { useState, useEffect } from 'react'
import { DAYS_OF_WEEK } from '../types'
import './ConnectionNight.css'

interface ConnectionNightProps {
  weekStart: string
}

export default function ConnectionNight({ weekStart }: ConnectionNightProps) {
  const [selectedNight, setSelectedNight] = useState('')
  const [notes, setNotes] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-rose-900 mb-2">💑 Intimacy & Connection Night</h2>
        <p className="text-gray-600">At-home quality time together</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Plan Connection Night */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-rose-100">
          <h3 className="text-xl font-bold text-rose-900 mb-4">Plan Your Night</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Which night?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day.num}
                  onClick={() => setSelectedNight(day.name)}
                  className={`p-3 rounded-lg border-2 transition font-medium ${
                    selectedNight === day.name
                      ? 'bg-rose-100 border-rose-500 text-rose-900'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-rose-300'
                  }`}
                >
                  {day.short}
                </button>
              ))}
            </div>
          </div>

          {selectedNight && (
            <div className="mb-4 p-4 bg-rose-50 rounded-lg border border-rose-200">
              <p className="text-sm text-rose-900">
                ✓ Connection night scheduled for {selectedNight}
              </p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes / Ideas:
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What would you like to do? Movies, dinner, massage, time in nature..."
              rows={4}
              className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <button
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium py-2 rounded-lg hover:from-rose-600 hover:to-pink-600 transition disabled:opacity-50"
            disabled={!selectedNight}
          >
            Save Connection Night
          </button>
        </div>

        {/* Ideas & Suggestions */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-pink-100">
          <h3 className="text-xl font-bold text-pink-900 mb-4">💡 Ideas</h3>

          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-pink-50 border border-pink-200 cursor-pointer hover:shadow-md transition">
              <p className="font-medium text-pink-900">🎬 Movie Night</p>
              <p className="text-xs text-gray-600 mt-1">Pick a movie and cuddle up</p>
            </div>

            <div className="p-3 rounded-lg bg-pink-50 border border-pink-200 cursor-pointer hover:shadow-md transition">
              <p className="font-medium text-pink-900">🍽️ Special Dinner</p>
              <p className="text-xs text-gray-600 mt-1">Cook a meal together or order takeout</p>
            </div>

            <div className="p-3 rounded-lg bg-pink-50 border border-pink-200 cursor-pointer hover:shadow-md transition">
              <p className="font-medium text-pink-900">💆 Couple's Massage</p>
              <p className="text-xs text-gray-600 mt-1">Give each other a relaxing massage</p>
            </div>

            <div className="p-3 rounded-lg bg-pink-50 border border-pink-200 cursor-pointer hover:shadow-md transition">
              <p className="font-medium text-pink-900">🚶 Nature Walk</p>
              <p className="text-xs text-gray-600 mt-1">Take a walk and enjoy each other's company</p>
            </div>

            <div className="p-3 rounded-lg bg-pink-50 border border-pink-200 cursor-pointer hover:shadow-md transition">
              <p className="font-medium text-pink-900">🧘 Yoga Together</p>
              <p className="text-xs text-gray-600 mt-1">Practice couples yoga or meditation</p>
            </div>

            <div className="p-3 rounded-lg bg-pink-50 border border-pink-200 cursor-pointer hover:shadow-md transition">
              <p className="font-medium text-pink-900">📚 Read to Each Other</p>
              <p className="text-xs text-gray-600 mt-1">Cuddle up and read a book together</p>
            </div>
          </div>
        </div>
      </div>

      {/* Past Connection Nights */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-rose-100">
        <h3 className="text-lg font-bold text-rose-900 mb-4">✨ Past Connection Nights</h3>
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-200">
            <p className="font-medium text-rose-900">Saturday, July 5</p>
            <p className="text-sm text-gray-600 mt-1">Watched a movie and made popcorn together</p>
          </div>
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-200">
            <p className="font-medium text-rose-900">Friday, June 28</p>
            <p className="text-sm text-gray-600 mt-1">Took a walk in the park and had ice cream</p>
          </div>
        </div>
      </div>
    </div>
  )
}
