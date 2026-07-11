import { useState, useEffect } from 'react'
import { Task, User } from '../types'
import { supabase } from '../lib/supabase'
import { formatDate } from '../lib/utils'
import './TaskWheel.css'

interface TaskWheelProps {
  weekStart: string
  currentUser: User
}

export default function TaskWheel({ weekStart, currentUser }: TaskWheelProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [spinning, setSpinning] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [uncompletedTasks, setUncompletedTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [showAddTask, setShowAddTask] = useState(false)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('completed', false)

    if (!error && data) {
      setTasks(data as Task[])
      setUncompletedTasks(data as Task[])
    }
    setLoading(false)
  }

  const addTask = async () => {
    if (!newTaskTitle.trim()) return

    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          title: newTaskTitle,
          created_by: currentUser,
          scheduled_date: null,
          completed: false,
        },
      ])
      .select()

    if (!error && data) {
      setTasks([...tasks, data[0]])
      setUncompletedTasks([...uncompletedTasks, data[0]])
      setNewTaskTitle('')
      setShowAddTask(false)
    }
  }

  const spinWheel = () => {
    if (uncompletedTasks.length === 0 || spinning) return

    setSpinning(true)
    setSelectedTask(null)

    const randomIndex = Math.floor(Math.random() * uncompletedTasks.length)
    const spins = 5 + Math.random() * 5
    const finalRotation = (randomIndex / uncompletedTasks.length) * 360

    setTimeout(() => {
      setSelectedTask(uncompletedTasks[randomIndex])
      setSpinning(false)
    }, 3000)
  }

  const scheduleTask = async () => {
    if (!selectedTask || !selectedDate) return

    const { error } = await supabase
      .from('tasks')
      .update({ scheduled_date: selectedDate })
      .eq('id', selectedTask.id)

    if (!error) {
      setSelectedTask(null)
      setSelectedDate('')
      loadTasks()
    }
  }

  const completeTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: true, completed_date: new Date().toISOString() })
      .eq('id', taskId)

    if (!error) {
      loadTasks()
    }
  }

  const removeTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (!error) {
      loadTasks()
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side: Wheel and Controls */}
        <div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-amber-100 mb-6">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">Task Wheel</h2>

            <div className="wheel-container mb-6">
              <svg viewBox="0 0 200 200" className={`wheel ${spinning ? 'spinning' : ''}`}>
                {uncompletedTasks.map((task, index) => {
                  const angle = (index / uncompletedTasks.length) * 360
                  const startAngle = angle
                  const endAngle = startAngle + (360 / uncompletedTasks.length)
                  const mid = (startAngle + endAngle) / 2
                  const rad = (mid * Math.PI) / 180
                  const x = 100 + 70 * Math.cos(rad)
                  const y = 100 + 70 * Math.sin(rad)

                  const colors = [
                    '#d97706', '#f59e0b', '#fbbf24', '#fcd34d',
                    '#a16207', '#92400e', '#78350f', '#b45309',
                  ]

                  return (
                    <g key={task.id}>
                      <path
                        d={`M 100 100 L ${100 + 80 * Math.cos((startAngle * Math.PI) / 180)} ${
                          100 + 80 * Math.sin((startAngle * Math.PI) / 180)
                        } A 80 80 0 ${endAngle - startAngle > 180 ? 1 : 0} 1 ${
                          100 + 80 * Math.cos((endAngle * Math.PI) / 180)
                        } ${100 + 80 * Math.sin((endAngle * Math.PI) / 180)} Z`}
                        fill={colors[index % colors.length]}
                        stroke="white"
                        strokeWidth="2"
                      />
                      <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dy="0.3em"
                        className="text-xs font-bold fill-white pointer-events-none"
                        fontSize="10"
                      >
                        {task.title.substring(0, 15)}
                      </text>
                    </g>
                  )
                })}
                <circle cx="100" cy="100" r="20" fill="white" stroke="#d97706" strokeWidth="2" />
                <text x="100" y="105" textAnchor="middle" className="text-xs font-bold" fontSize="12">
                  SPIN
                </text>
              </svg>

              <div className="pointer absolute top-0 left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-orange-500"></div>
              </div>
            </div>

            <button
              onClick={spinWheel}
              disabled={spinning || uncompletedTasks.length === 0}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 rounded-lg hover:from-orange-600 hover:to-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {spinning ? 'Spinning...' : 'SPIN THE WHEEL 🎡'}
            </button>

            {uncompletedTasks.length === 0 && (
              <p className="text-center text-gray-600 text-sm">
                Add some tasks to get started!
              </p>
            )}
          </div>

          {/* Selected Task */}
          {selectedTask && (
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-md p-6 border-2 border-orange-200">
              <h3 className="text-lg font-bold text-amber-900 mb-4">✨ Selected Task</h3>
              <p className="text-xl font-bold text-orange-600 mb-4">{selectedTask.title}</p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule for:
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                onClick={scheduleTask}
                disabled={!selectedDate}
                className="w-full bg-orange-500 text-white font-medium py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
              >
                Schedule Task
              </button>
            </div>
          )}
        </div>

        {/* Right side: Task List */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-amber-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-amber-900">Task Pool</h3>
            <button
              onClick={() => setShowAddTask(!showAddTask)}
              className="px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm"
            >
              + Add Task
            </button>
          </div>

          {showAddTask && (
            <div className="mb-4 pb-4 border-b border-amber-100">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter task name..."
                className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-orange-500 mb-2"
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
              <div className="flex gap-2">
                <button
                  onClick={addTask}
                  className="flex-1 bg-orange-500 text-white font-medium py-2 rounded-lg hover:bg-orange-600 transition"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddTask(false)}
                  className="flex-1 bg-gray-300 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {uncompletedTasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-lg border transition ${
                  selectedTask?.id === task.id
                    ? 'bg-orange-100 border-orange-400'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{task.title}</p>
                    {task.scheduled_date && (
                      <p className="text-xs text-gray-600 mt-1">
                        📅 {formatDate(task.scheduled_date)}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => completeTask(task.id)}
                      className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition"
                      title="Mark as completed"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                      title="Remove task"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {uncompletedTasks.length === 0 && !showAddTask && (
            <p className="text-center text-gray-500 py-8">No tasks yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
