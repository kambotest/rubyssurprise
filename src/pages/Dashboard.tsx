import { useWeek } from '../context/WeekContext'
import { formatDate } from '../lib/utils'
import './Dashboard.css'

export default function Dashboard() {
  const { weekStart, weekEnd, weekStartString, isOdd } = useWeek()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-amber-900 mb-2">Weekly Check-In</h1>
            <p className="text-gray-600">
              {formatDate(weekStart)} — {formatDate(weekEnd)}
            </p>
            <p className="text-amber-700 font-medium mt-2">
              {isOdd ? '💑 Date Night Week' : '🍽️ Hosting Week'}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-amber-200 rounded-lg hover:bg-amber-50 transition">
              ← Previous
            </button>
            <button className="px-4 py-2 bg-white border border-amber-200 rounded-lg hover:bg-amber-50 transition">
              Today
            </button>
            <button className="px-4 py-2 bg-white border border-amber-200 rounded-lg hover:bg-amber-50 transition">
              Next →
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Task Wheel Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-amber-100 hover:shadow-lg transition">
          <h2 className="text-2xl font-bold text-amber-900 mb-2">🎡 Task Wheel</h2>
          <p className="text-gray-600 mb-4">Spin to select a household chore</p>
          <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium py-3 rounded-lg hover:from-orange-600 hover:to-amber-600 transition">
            Go to Task Wheel
          </button>
        </div>

        {/* Self-Care Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-amber-100 hover:shadow-lg transition">
          <h2 className="text-2xl font-bold text-amber-900 mb-2">🧘 Self-Care</h2>
          <p className="text-gray-600 mb-4">Screen-free time for each parent</p>
          <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium py-3 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition">
            Plan Self-Care
          </button>
        </div>

        {/* Connection Night Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-amber-100 hover:shadow-lg transition">
          <h2 className="text-2xl font-bold text-amber-900 mb-2">💑 Connection Night</h2>
          <p className="text-gray-600 mb-4">At-home quality time together</p>
          <button className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium py-3 rounded-lg hover:from-rose-600 hover:to-pink-600 transition">
            Schedule Connection
          </button>
        </div>

        {/* Date Night / Hosting Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-amber-100 hover:shadow-lg transition">
          <h2 className="text-2xl font-bold text-amber-900 mb-2">
            {isOdd ? '🌙 Date Night' : '🍽️ Hosting'}
          </h2>
          <p className="text-gray-600 mb-4">
            {isOdd ? 'Plan your date night & babysitter' : 'Plan your hosted meal'}
          </p>
          <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium py-3 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition">
            {isOdd ? 'Plan Date Night' : 'Plan Hosting'}
          </button>
        </div>

        {/* Nightly Closing Shift Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-amber-100 hover:shadow-lg transition">
          <h2 className="text-2xl font-bold text-amber-900 mb-2">✅ Nightly Closing</h2>
          <p className="text-gray-600 mb-4">Daily self-care rituals checklist</p>
          <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium py-3 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition">
            View Checklist
          </button>
        </div>

        {/* Open Loops Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-amber-100 hover:shadow-lg transition">
          <h2 className="text-2xl font-bold text-amber-900 mb-2">🔄 Open Loops</h2>
          <p className="text-gray-600 mb-4">Decisions and tasks being tracked</p>
          <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-400 text-white font-medium py-3 rounded-lg hover:from-yellow-600 hover:to-orange-500 transition">
            Manage Loops
          </button>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-amber-100">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">This Week's Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
            <p className="text-sm text-gray-600">Tasks Scheduled</p>
            <p className="text-3xl font-bold text-amber-900">0</p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
            <p className="text-sm text-gray-600">Self-Care Set</p>
            <p className="text-3xl font-bold text-indigo-900">0</p>
          </div>
          <div className="bg-rose-50 rounded-lg p-4 border border-rose-100">
            <p className="text-sm text-gray-600">Connection Night</p>
            <p className="text-3xl font-bold text-rose-900">—</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <p className="text-sm text-gray-600">Closing Shift Avg</p>
            <p className="text-3xl font-bold text-blue-900">0%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
