import { useState } from 'react'
import { User, DAYS_OF_WEEK } from '../types'
import { OTHER_PARENT } from '../types'
import './DateNightHosting.css'

interface DateNightHostingProps {
  isOddWeek: boolean
  planner: User
  otherParent: User
}

export default function DateNightHosting({
  isOddWeek,
  planner,
  otherParent,
}: DateNightHostingProps) {
  const [selectedNight, setSelectedNight] = useState('')
  const [babysitter, setBabysitter] = useState('')
  const [location, setLocation] = useState('')
  const [menu, setMenu] = useState('')
  const [guestsList, setGuestsList] = useState('')
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // TODO: Save to database
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {isOddWeek ? (
        // Date Night Mode
        <>
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-emerald-900 mb-2">🌙 Date Night Week</h2>
            <p className="text-gray-600">Plan your special night out together</p>
            {planner === otherParent && (
              <p className="text-sm text-emerald-700 font-medium mt-2">
                💑 {OTHER_PARENT[otherParent] === 'ruby' ? 'Ruby' : 'James'} is planning this date night
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Planning Form */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100">
              <h3 className="text-xl font-bold text-emerald-900 mb-4">Date Night Details</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Which night?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {DAYS_OF_WEEK.slice(4, 7).map((day) => (
                    <button
                      key={day.num}
                      onClick={() => setSelectedNight(day.name)}
                      className={`p-3 rounded-lg border-2 transition font-medium ${
                        selectedNight === day.name
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-emerald-300'
                      }`}
                    >
                      {day.short}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location / Activity:
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Italian restaurant, hiking trail, movie..."
                  className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Babysitter Details:
                </label>
                <input
                  type="text"
                  value={babysitter}
                  onChange={(e) => setBabysitter(e.target.value)}
                  placeholder="Name and phone number"
                  className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes:
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Reservation time, what to wear, special surprises..."
                  rows={3}
                  className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium py-2 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition"
              >
                {saved ? '✓ Saved!' : 'Save Date Night'}
              </button>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-md p-6 border-2 border-emerald-200">
              <h3 className="text-xl font-bold text-emerald-900 mb-4">Your Special Night</h3>

              {selectedNight ? (
                <>
                  <div className="mb-4 p-3 bg-white rounded-lg border border-emerald-200">
                    <p className="text-xs text-gray-600">Night</p>
                    <p className="text-lg font-bold text-emerald-900">{selectedNight}</p>
                  </div>

                  {location && (
                    <div className="mb-4 p-3 bg-white rounded-lg border border-emerald-200">
                      <p className="text-xs text-gray-600">Location</p>
                      <p className="text-lg font-bold text-emerald-900">{location}</p>
                    </div>
                  )}

                  {babysitter && (
                    <div className="mb-4 p-3 bg-white rounded-lg border border-emerald-200">
                      <p className="text-xs text-gray-600">Babysitter</p>
                      <p className="text-lg font-bold text-emerald-900">{babysitter}</p>
                    </div>
                  )}

                  <div className="bg-white rounded-lg p-4 border-2 border-green-400">
                    <p className="text-center text-green-900 font-bold">
                      ✓ Clara is taken care of!
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-center text-emerald-700 py-8">Select a night to get started</p>
              )}
            </div>
          </div>
        </>
      ) : (
        // Hosting Mode
        <>
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-orange-900 mb-2">🍽️ Hosting Week</h2>
            <p className="text-gray-600">Plan your hosted meal with guests</p>
            {planner === otherParent && (
              <p className="text-sm text-orange-700 font-medium mt-2">
                👥 {OTHER_PARENT[otherParent] === 'ruby' ? 'Ruby' : 'James'} is planning this hosting
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Planning Form */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-orange-100">
              <h3 className="text-xl font-bold text-orange-900 mb-4">Hosting Details</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Which night?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {DAYS_OF_WEEK.slice(4, 7).map((day) => (
                    <button
                      key={day.num}
                      onClick={() => setSelectedNight(day.name)}
                      className={`p-3 rounded-lg border-2 transition font-medium ${
                        selectedNight === day.name
                          ? 'bg-orange-100 border-orange-500 text-orange-900'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-orange-300'
                      }`}
                    >
                      {day.short}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guest List (names):
                </label>
                <textarea
                  value={guestsList}
                  onChange={(e) => setGuestsList(e.target.value)}
                  placeholder="List the guests coming over..."
                  rows={3}
                  className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Menu Plan:
                </label>
                <textarea
                  value={menu}
                  onChange={(e) => setMenu(e.target.value)}
                  placeholder="Main dish, sides, dessert, drinks..."
                  rows={3}
                  className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes:
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Setup time, dietary restrictions, entertainment..."
                  rows={2}
                  className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium py-2 rounded-lg hover:from-orange-600 hover:to-amber-600 transition"
              >
                {saved ? '✓ Saved!' : 'Save Hosting Plans'}
              </button>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-md p-6 border-2 border-orange-200">
              <h3 className="text-xl font-bold text-orange-900 mb-4">Hosting Summary</h3>

              {selectedNight ? (
                <>
                  <div className="mb-4 p-3 bg-white rounded-lg border border-orange-200">
                    <p className="text-xs text-gray-600">Night</p>
                    <p className="text-lg font-bold text-orange-900">{selectedNight}</p>
                  </div>

                  {guestsList && (
                    <div className="mb-4 p-3 bg-white rounded-lg border border-orange-200">
                      <p className="text-xs text-gray-600">Guests</p>
                      <div className="text-sm font-medium text-orange-900 mt-1">
                        {guestsList.split('\n').map((guest, i) => (
                          <div key={i}>{guest.trim()}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {menu && (
                    <div className="mb-4 p-3 bg-white rounded-lg border border-orange-200">
                      <p className="text-xs text-gray-600">Menu</p>
                      <p className="text-sm font-medium text-orange-900 mt-1">{menu}</p>
                    </div>
                  )}

                  <div className="bg-white rounded-lg p-4 border-2 border-green-400">
                    <p className="text-center text-green-900 font-bold">
                      ✓ No babysitter needed!
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-center text-orange-700 py-8">Select a night to get started</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
