import { useState, useEffect } from 'react'
import { Check, X, Plus } from 'lucide-react'
import { Task, User } from '../types'
import { supabase } from '../lib/supabase'
import { formatDate } from '../lib/utils'
import { validation, showToast } from '../lib/validation'
import './TaskWheel.css'

interface TaskWheelProps {
  weekStart: string
  currentUser: User
}

const WHEEL_TONES = [
  '#8a6a4a', '#a68a68', '#6f5439', '#bda98a',
  '#7c5c3d', '#c8b899', '#5c4632', '#9c8264',
]

export default function TaskWheel({ currentUser }: TaskWheelProps) {
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
    const titleError = validation.taskTitle(newTaskTitle)
    if (titleError) {
      showToast(titleError, 'error')
      return
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          title: validation.sanitize(newTaskTitle),
          created_by: currentUser,
          scheduled_date: null,
          completed: false,
        },
      ])
      .select()

    if (error) {
      showToast('Could not add task', 'error')
    } else if (data) {
      setTasks([...tasks, data[0]])
      setUncompletedTasks([...uncompletedTasks, data[0]])
      setNewTaskTitle('')
      setShowAddTask(false)
      showToast('Task added', 'success')
    }
  }

  const spinWheel = () => {
    if (uncompletedTasks.length === 0 || spinning) return

    setSpinning(true)
    setSelectedTask(null)

    const randomIndex = Math.floor(Math.random() * uncompletedTasks.length)

    setTimeout(() => {
      setSelectedTask(uncompletedTasks[randomIndex])
      setSpinning(false)
    }, 3000)
  }

  const scheduleTask = async () => {
    if (!selectedTask || !selectedDate) {
      showToast('Please choose a date', 'error')
      return
    }

    const { error } = await supabase
      .from('tasks')
      .update({ scheduled_date: selectedDate })
      .eq('id', selectedTask.id)

    if (error) {
      showToast('Could not schedule task', 'error')
    } else {
      showToast('Task scheduled', 'success')
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

    if (error) {
      showToast('Could not complete task', 'error')
    } else {
      showToast('Task complete', 'success')
      loadTasks()
    }
  }

  const removeTask = async (taskId: string) => {
    if (!confirm('Remove this task?')) return

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) {
      showToast('Could not remove task', 'error')
    } else {
      showToast('Task removed', 'success')
      loadTasks()
    }
  }

  if (loading) {
    return <div className="empty">Loading…</div>
  }

  const count = uncompletedTasks.length

  return (
    <div>
      <div className="section-head">
        <span className="eyebrow">No. 01</span>
        <h2 className="display display--lg">The Task Wheel</h2>
        <p className="lede">Add the chores worth doing, then let the wheel decide which one earns this week.</p>
      </div>

      <div className="grid-2 grid-2--wide">
        {/* Wheel */}
        <div className="stack-md">
          <div className="card">
            <div className="wheel-stage">
              <div className="wheel-marker" />
              <svg viewBox="0 0 200 200" className={`wheel ${spinning ? 'spinning' : ''}`}>
                {count > 0 ? (
                  uncompletedTasks.map((task, index) => {
                    const startAngle = (index / count) * 360
                    const endAngle = startAngle + 360 / count
                    const mid = (startAngle + endAngle) / 2
                    const rad = (mid * Math.PI) / 180
                    const x = 100 + 62 * Math.cos(rad)
                    const y = 100 + 62 * Math.sin(rad)

                    return (
                      <g key={task.id}>
                        <path
                          d={`M 100 100 L ${100 + 92 * Math.cos((startAngle * Math.PI) / 180)} ${
                            100 + 92 * Math.sin((startAngle * Math.PI) / 180)
                          } A 92 92 0 ${endAngle - startAngle > 180 ? 1 : 0} 1 ${
                            100 + 92 * Math.cos((endAngle * Math.PI) / 180)
                          } ${100 + 92 * Math.sin((endAngle * Math.PI) / 180)} Z`}
                          fill={WHEEL_TONES[index % WHEEL_TONES.length]}
                          stroke="#f4f2ec"
                          strokeWidth="1"
                        />
                        <text
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dy="0.3em"
                          fill="#f4f2ec"
                          fontSize="7"
                          fontFamily="Jost, sans-serif"
                          letterSpacing="0.5"
                          transform={`rotate(${mid} ${x} ${y})`}
                          className="wheel-label"
                        >
                          {task.title.substring(0, 16)}
                        </text>
                      </g>
                    )
                  })
                ) : (
                  <circle cx="100" cy="100" r="92" fill="#eeebe2" />
                )}
                <circle cx="100" cy="100" r="26" fill="#fbfaf6" stroke="#201d18" strokeWidth="1" />
                <text
                  x="100" y="103" textAnchor="middle" fill="#201d18"
                  fontSize="8" fontFamily="Jost, sans-serif" letterSpacing="2"
                >
                  SPIN
                </text>
              </svg>
            </div>

            <button
              onClick={spinWheel}
              disabled={spinning || count === 0}
              className="btn btn--primary btn--block btn--lg mt-6"
            >
              {spinning ? 'Spinning…' : 'Spin the Wheel'}
            </button>

            {count === 0 && (
              <p className="meta text-center mt-6">Add a task or two to begin.</p>
            )}
          </div>

          {selectedTask && (
            <div className="card card--raised">
              <span className="eyebrow">Drawn This Week</span>
              <p className="display display--sm mt-6">{selectedTask.title}</p>
              <hr className="rule" />
              <div className="field">
                <label className="label">Schedule for</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input"
                />
              </div>
              <button onClick={scheduleTask} disabled={!selectedDate} className="btn btn--accent btn--block">
                Set the Day
              </button>
            </div>
          )}
        </div>

        {/* Pool */}
        <div className="card">
          <div className="spread card-title--tight">
            <h3 className="card-title" style={{ marginBottom: 0 }}>Task Pool</h3>
            <button onClick={() => setShowAddTask(!showAddTask)} className="btn btn--ghost btn--sm">
              <Plus size={14} /> Add
            </button>
          </div>

          {showAddTask && (
            <div className="field mt-6">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Name the task…"
                className="input"
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                autoFocus
              />
              <div className="cluster mt-6">
                <button onClick={addTask} className="btn btn--primary btn--sm">Add Task</button>
                <button onClick={() => setShowAddTask(false)} className="btn btn--ghost btn--sm">Cancel</button>
              </div>
            </div>
          )}

          <hr className="rule" />

          {count === 0 ? (
            <p className="empty">The pool is empty.</p>
          ) : (
            <div className="rows">
              {uncompletedTasks.map((task) => (
                <div key={task.id} className={`row ${selectedTask?.id === task.id ? 'row--active' : ''}`}>
                  <div>
                    <p className="row__title">{task.title}</p>
                    {task.scheduled_date && (
                      <p className="row__meta">{formatDate(task.scheduled_date)}</p>
                    )}
                  </div>
                  <div className="row__actions">
                    <button onClick={() => completeTask(task.id)} className="btn-icon" title="Mark complete">
                      <Check />
                    </button>
                    <button onClick={() => removeTask(task.id)} className="btn-icon btn-icon--danger" title="Remove">
                      <X />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
