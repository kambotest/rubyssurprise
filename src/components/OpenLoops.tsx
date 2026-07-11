import { useState, useEffect } from 'react'
import { OpenLoop, User } from '../types'
import { supabase } from '../lib/supabase'
import './OpenLoops.css'

interface OpenLoopsProps {
  currentUser: User
}

export default function OpenLoops({ currentUser }: OpenLoopsProps) {
  const [loops, setLoops] = useState<OpenLoop[]>([])
  const [closedLoops, setClosedLoops] = useState<OpenLoop[]>([])
  const [loading, setLoading] = useState(true)
  const [newLoopTitle, setNewLoopTitle] = useState('')
  const [showAddLoop, setShowAddLoop] = useState(false)
  const [closingLoop, setClosingLoop] = useState<string | null>(null)

  useEffect(() => {
    loadLoops()
  }, [])

  const loadLoops = async () => {
    setLoading(true)
    const { data: openData, error: openError } = await supabase
      .from('open_loops')
      .select('*')
      .is('closed_at', null)
      .order('created_at', { ascending: false })

    const { data: closedData, error: closedError } = await supabase
      .from('open_loops')
      .select('*')
      .not('closed_at', 'is', null)
      .order('closed_at', { ascending: false })
      .limit(10)

    if (!openError && openData) {
      setLoops(openData as OpenLoop[])
    }
    if (!closedError && closedData) {
      setClosedLoops(closedData as OpenLoop[])
    }
    setLoading(false)
  }

  const addLoop = async () => {
    if (!newLoopTitle.trim()) return

    const { data, error } = await supabase
      .from('open_loops')
      .insert([
        {
          title: newLoopTitle,
          created_by: currentUser,
          closed_at: null,
        },
      ])
      .select()

    if (!error && data) {
      setLoops([data[0], ...loops])
      setNewLoopTitle('')
      setShowAddLoop(false)
    }
  }

  const closeLoop = async (loopId: string) => {
    setClosingLoop(loopId)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const { error } = await supabase
      .from('open_loops')
      .update({ closed_at: new Date().toISOString() })
      .eq('id', loopId)

    if (!error) {
      const closedLoop = loops.find((l) => l.id === loopId)
      if (closedLoop) {
        setLoops(loops.filter((l) => l.id !== loopId))
        setClosedLoops([{ ...closedLoop, closed_at: new Date().toISOString() }, ...closedLoops])
      }
    }

    setClosingLoop(null)
  }

  const deleteLoop = async (loopId: string) => {
    const { error } = await supabase
      .from('open_loops')
      .delete()
      .eq('id', loopId)

    if (!error) {
      setLoops(loops.filter((l) => l.id !== loopId))
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading loops...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-yellow-900 mb-2">🔄 Open Loops</h2>
        <p className="text-gray-600">Decisions and tasks being tracked</p>
      </div>

      {/* Add New Loop */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-yellow-100 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-yellow-900">Add New Loop</h3>
          {showAddLoop && (
            <button
              onClick={() => setShowAddLoop(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          )}
        </div>

        {showAddLoop ? (
          <div className="space-y-4">
            <input
              type="text"
              value={newLoopTitle}
              onChange={(e) => setNewLoopTitle(e.target.value)}
              placeholder="What decision or task needs to be closed?"
              className="w-full px-4 py-2 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500"
              onKeyPress={(e) => e.key === 'Enter' && addLoop()}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={addLoop}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-400 text-white font-medium py-2 rounded-lg hover:from-yellow-600 hover:to-orange-500 transition"
              >
                Add Loop
              </button>
              <button
                onClick={() => setShowAddLoop(false)}
                className="flex-1 bg-gray-300 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddLoop(true)}
            className="w-full px-4 py-2 bg-yellow-100 text-yellow-900 font-medium rounded-lg hover:bg-yellow-200 transition border border-yellow-200"
          >
            + Add New Loop
          </button>
        )}
      </div>

      {/* Open Loops */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-yellow-100 mb-6">
        <h3 className="text-xl font-bold text-yellow-900 mb-4">
          Open Loops ({loops.length})
        </h3>

        {loops.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No open loops! Great job!</p>
        ) : (
          <div className="space-y-3">
            {loops.map((loop) => (
              <div
                key={loop.id}
                className={`p-4 rounded-lg border-2 transition ${
                  closingLoop === loop.id
                    ? 'closing-loop bg-yellow-50 border-yellow-400'
                    : 'bg-yellow-50 border-yellow-200 hover:border-yellow-400'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{loop.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created by {loop.created_by}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => closeLoop(loop.id)}
                      disabled={closingLoop === loop.id}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 font-medium"
                    >
                      {closingLoop === loop.id ? '✓ Closing...' : 'Close'}
                    </button>
                    <button
                      onClick={() => deleteLoop(loop.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Closed Loops Archive */}
      {closedLoops.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            ✨ Recently Closed ({closedLoops.length})
          </h3>
          <div className="space-y-2">
            {closedLoops.map((loop) => (
              <div
                key={loop.id}
                className="p-3 rounded-lg bg-gray-50 border border-gray-200 opacity-75"
              >
                <p className="line-through text-gray-600">{loop.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Closed {loop.closed_at ? new Date(loop.closed_at).toLocaleDateString() : 'recently'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
