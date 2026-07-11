import { useWeek } from '../context/WeekContext'
import { useAuth } from '../context/AuthContext'
import { formatDate } from '../lib/utils'
import TaskWheel from '../components/TaskWheel'
import SelfCareForm from '../components/SelfCareForm'
import ConnectionNight from '../components/ConnectionNight'
import DateNightHosting from '../components/DateNightHosting'
import NightlyClosing from '../components/NightlyClosing'
import OpenLoops from '../components/OpenLoops'
import './Dashboard.css'

type PageType = 'dashboard' | 'taskwheel' | 'selfcare' | 'connection' | 'datenighthosting' | 'nightlyclosing' | 'openloops'

interface DashboardProps {
  currentPage: PageType
  onNavigate: (page: PageType) => void
}

export default function Dashboard({ currentPage, onNavigate }: DashboardProps) {
  const { weekStart, weekEnd, weekStartString, isOdd, goToPreviousWeek, goToNextWeek, goToCurrentWeek } = useWeek()
  const { parent, user } = useAuth()

  if (!parent || !user) {
    return <div className="text-center py-8">Loading...</div>
  }

  const otherParent = parent === 'ruby' ? 'james' : 'ruby'

  if (currentPage === 'taskwheel') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => onNavigate('dashboard')}
          className="mb-6 px-4 py-2 bg-white border border-amber-200 rounded-lg hover:bg-amber-50 transition"
        >
          ← Back to Dashboard
        </button>
        <TaskWheel weekStart={weekStartString} currentUser={parent} />
      </div>
    )
  }

  if (currentPage === 'selfcare') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => onNavigate('dashboard')}
          className="mb-6 px-4 py-2 bg-white border border-amber-200 rounded-lg hover:bg-amber-50 transition"
        >
          ← Back to Dashboard
        </button>
        <SelfCareForm weekStart={weekStartString} parent={parent} otherParent={otherParent as any} />
      </div>
    )
  }

  if (currentPage === 'connection') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => onNavigate('dashboard')}
          className="mb-6 px-4 py-2 bg-white border border-amber-200 rounded-lg hover:bg-amber-50 transition"
        >
          ← Back to Dashboard
        </button>
        <ConnectionNight weekStart={weekStartString} />
      </div>
    )
  }

  if (currentPage === 'datenighthosting') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => onNavigate('dashboard')}
          className="mb-6 px-4 py-2 bg-white border border-amber-200 rounded-lg hover:bg-amber-50 transition"
        >
          ← Back to Dashboard
        </button>
        <DateNightHosting isOddWeek={isOdd} planner={parent} otherParent={otherParent as any} />
      </div>
    )
  }

  if (currentPage === 'nightlyclosing') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => onNavigate('dashboard')}
          className="mb-6 px-4 py-2 bg-white border border-amber-200 rounded-lg hover:bg-amber-50 transition"
        >
          ← Back to Dashboard
        </button>
        <NightlyClosing weekStart={weekStart} currentUser={parent} />
      </div>
    )
  }

  if (currentPage === 'openloops') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => onNavigate('dashboard')}
          className="mb-6 px-4 py-2 bg-white border border-amber-200 rounded-lg hover:bg-amber-50 transition"
        >
          ← Back to Dashboard
        </button>
        <OpenLoops currentUser={parent} />
      </div>
    )
  }

  // Dashboard view
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-amber-900 mb-2">Weekly Check-In</h1>
            <p className="text-gray-600">
              {formatDate(weekStart)} — {formatDate(weekEnd)}
            </p>
            <p className="text-amber-700 font-medium mt-2">
              {isOdd ? '💑 Date Night Week' : '🍽️ Hosting Week'}
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button
              onClick={goToPreviousWeek}
              className="px-4 py-2 bg-white border border-amber-200 rounded-lg hover:bg-amber-50 transition"
            >
              ← Previous
            </button>
            <button
              onClick={goToCurrentWeek}
              className="px-4 py-2 bg-white border border-amber-200 rounded-lg hover:bg-amber-50 transition"
            >
              Today
            </button>
            <button
              onClick={goToNextWeek}
              className="px-4 py-2 bg-white border border-amber-200 rounded-lg hover:bg-amber-50 transition"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Task Wheel Card */}
        <button
          onClick={() => onNavigate('taskwheel')}
          className="bg-white rounded-xl shadow-md p-6 border border-amber-100 hover:shadow-lg transition text-left"
        >
          <h2 className="text-2xl font-bold text-amber-900 mb-2">🎡 Task Wheel</h2>
          <p className="text-gray-600 mb-4">Spin to select a household chore</p>
          <div className="text-orange-600 font-medium">Go to Task Wheel →</div>
        </button>

        {/* Self-Care Card */}
        <button
          onClick={() => onNavigate('selfcare')}
          className="bg-white rounded-xl shadow-md p-6 border border-amber-100 hover:shadow-lg transition text-left"
        >
          <h2 className="text-2xl font-bold text-amber-900 mb-2">🧘 Self-Care</h2>
          <p className="text-gray-600 mb-4">Screen-free time for each parent</p>
          <div className="text-indigo-600 font-medium">Plan Self-Care →</div>
        </button>

        {/* Connection Night Card */}
        <button
          onClick={() => onNavigate('connection')}
          className="bg-white rounded-xl shadow-md p-6 border border-amber-100 hover:shadow-lg transition text-left"
        >
          <h2 className="text-2xl font-bold text-amber-900 mb-2">💑 Connection Night</h2>
          <p className="text-gray-600 mb-4">At-home quality time together</p>
          <div className="text-rose-600 font-medium">Schedule Connection →</div>
        </button>

        {/* Date Night / Hosting Card */}
        <button
          onClick={() => onNavigate('datenighthosting')}
          className="bg-white rounded-xl shadow-md p-6 border border-amber-100 hover:shadow-lg transition text-left"
        >
          <h2 className="text-2xl font-bold text-amber-900 mb-2">
            {isOdd ? '🌙 Date Night' : '🍽️ Hosting'}
          </h2>
          <p className="text-gray-600 mb-4">
            {isOdd ? 'Plan your date night & babysitter' : 'Plan your hosted meal'}
          </p>
          <div className="text-emerald-600 font-medium">{isOdd ? 'Plan Date Night' : 'Plan Hosting'} →</div>
        </button>

        {/* Nightly Closing Shift Card */}
        <button
          onClick={() => onNavigate('nightlyclosing')}
          className="bg-white rounded-xl shadow-md p-6 border border-amber-100 hover:shadow-lg transition text-left"
        >
          <h2 className="text-2xl font-bold text-amber-900 mb-2">✅ Nightly Closing</h2>
          <p className="text-gray-600 mb-4">Daily self-care rituals checklist</p>
          <div className="text-blue-600 font-medium">View Checklist →</div>
        </button>

        {/* Open Loops Card */}
        <button
          onClick={() => onNavigate('openloops')}
          className="bg-white rounded-xl shadow-md p-6 border border-amber-100 hover:shadow-lg transition text-left"
        >
          <h2 className="text-2xl font-bold text-amber-900 mb-2">🔄 Open Loops</h2>
          <p className="text-gray-600 mb-4">Decisions and tasks being tracked</p>
          <div className="text-yellow-600 font-medium">Manage Loops →</div>
        </button>
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
