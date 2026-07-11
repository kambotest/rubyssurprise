import { useState, useEffect } from 'react'
import { Plus, X, Check } from 'lucide-react'
import { User } from '../types'
import { validation, showToast } from '../lib/validation'
import './TaskSwap.css'

interface TaskSwapProps {
  weekStart: string
  parent: User
  otherParent: User
}

interface AssignedTask {
  id: string
  title: string
  assignedBy: User
  assignedTo: User
  completed: boolean
  week: string
}

export default function TaskSwap({ weekStart, parent, otherParent }: TaskSwapProps) {
  const [tasks, setTasks] = useState<AssignedTask[]>([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadTasks()
  }, [weekStart])

  const loadTasks = () => {
    const stored = localStorage.getItem('rubyssurprise_taskswap')
    if (stored) {
      const allTasks = JSON.parse(stored)
      setTasks(allTasks.filter((t: AssignedTask) => t.week === weekStart))
    }
  }

  const saveTasks = (updated: AssignedTask[]) => {
    const stored = localStorage.getItem('rubyssurprise_taskswap') || '[]'
    const allTasks = JSON.parse(stored)
    const otherWeeks = allTasks.filter((t: AssignedTask) => t.week !== weekStart)
    const merged = [...otherWeeks, ...updated]
    localStorage.setItem('rubyssurprise_taskswap', JSON.stringify(merged))
  }

  const assignTask = async () => {
    const error = validation.taskTitle(newTask)
    if (error) {
      showToast(error, 'error')
      return
    }

    setLoading(true)
    try {
      const task: AssignedTask = {
        id: Math.random().toString(36).substr(2, 9),
        title: newTask,
        assignedBy: parent,
        assignedTo: otherParent,
        completed: false,
        week: weekStart,
      }
      const updated = [...tasks, task]
      setTasks(updated)
      saveTasks(updated)
      setNewTask('')
      showToast('Task assigned', 'success')
    } catch {
      showToast('Could not assign task', 'error')
    } finally {
      setLoading(false)
    }
  }

  const toggleComplete = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    setTasks(updated)
    saveTasks(updated)
  }

  const removeTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id)
    setTasks(updated)
    saveTasks(updated)
  }

  const parentName = parent === 'ruby' ? 'Ruby' : 'James'
  const otherName = otherParent === 'ruby' ? 'Ruby' : 'James'

  const tasksForMe = tasks.filter(t => t.assignedTo === parent)
  const tasksFromMe = tasks.filter(t => t.assignedBy === parent)
  const completedCount = tasksForMe.filter(t => t.completed).length

  return (
    <div>
      <div className="section-head">
        <span className="eyebrow">No. 05</span>
        <h2 className="display display--lg">The Task Swap</h2>
        <p className="lede">Assign a task to each other for the week. The other person completes it for you.</p>
      </div>

      <div className="grid-2 grid-2--wide">
        {/* Tasks assigned to you */}
        <div className="card">
          <h3 className="card-title">Assigned to You</h3>

          {tasksForMe.length === 0 ? (
            <p className="empty">No tasks assigned yet.</p>
          ) : (
            <div className="task-list">
              {tasksForMe.map(task => (
                <div key={task.id} className={`task-row ${task.completed ? 'task-row--done' : ''}`}>
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className="task-row__check"
                    aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {task.completed && <Check size={20} />}
                  </button>
                  <span className="task-row__title">{task.title}</span>
                  <span className="task-row__from">{otherName}</span>
                  <button
                    onClick={() => removeTask(task.id)}
                    className="task-row__remove"
                    aria-label="Remove task"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {tasksForMe.length > 0 && (
            <div className="panel panel--positive mt-6">
              You've completed {completedCount} of {tasksForMe.length}
            </div>
          )}
        </div>

        {/* Assign a task to them */}
        <div className="card">
          <h3 className="card-title">Assign to {otherName}</h3>

          <div className="field">
            <label className="label">Task for them</label>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Clean the gutters, organize the pantry…"
              className="input"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) assignTask()
              }}
            />
          </div>

          <button
            onClick={assignTask}
            disabled={loading || !newTask}
            className="btn btn--primary btn--block"
          >
            {loading ? 'Assigning…' : 'Assign Task'}
          </button>

          {tasksFromMe.length > 0 && (
            <div className="mt-6 pt-6 border-t border-bronze-200">
              <span className="meta">Tasks you assigned</span>
              <div className="task-list mt-4">
                {tasksFromMe.map(task => (
                  <div key={task.id} className={`task-row ${task.completed ? 'task-row--done' : ''}`}>
                    <button
                      onClick={() => toggleComplete(task.id)}
                      className="task-row__check"
                      aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {task.completed && <Check size={20} />}
                    </button>
                    <span className="task-row__title">{task.title}</span>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="task-row__remove"
                      aria-label="Remove task"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
