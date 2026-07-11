import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { OpenLoop, User } from '../types'
import { supabase } from '../lib/supabase'
import { validation, showToast } from '../lib/validation'
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
    const error = validation.loopTitle(newLoopTitle)
    if (error) {
      showToast(error, 'error')
      return
    }

    const { data, error: dbError } = await supabase
      .from('open_loops')
      .insert([
        {
          title: validation.sanitize(newLoopTitle),
          created_by: currentUser,
          closed_at: null,
        },
      ])
      .select()

    if (dbError) {
      showToast('Could not add loop', 'error')
    } else if (data) {
      setLoops([data[0], ...loops])
      setNewLoopTitle('')
      setShowAddLoop(false)
      showToast('Loop opened', 'success')
    }
  }

  const closeLoop = async (loopId: string) => {
    setClosingLoop(loopId)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const { error } = await supabase
      .from('open_loops')
      .update({ closed_at: new Date().toISOString() })
      .eq('id', loopId)

    if (error) {
      showToast('Could not close loop', 'error')
      setClosingLoop(null)
    } else {
      const closedLoop = loops.find((l) => l.id === loopId)
      if (closedLoop) {
        setLoops(loops.filter((l) => l.id !== loopId))
        setClosedLoops([{ ...closedLoop, closed_at: new Date().toISOString() }, ...closedLoops])
        showToast('Loop closed', 'success')
      }
      setClosingLoop(null)
    }
  }

  const deleteLoop = async (loopId: string) => {
    if (!confirm('Delete this loop?')) return

    const { error } = await supabase
      .from('open_loops')
      .delete()
      .eq('id', loopId)

    if (error) {
      showToast('Could not delete loop', 'error')
    } else {
      setLoops(loops.filter((l) => l.id !== loopId))
      showToast('Loop deleted', 'success')
    }
  }

  if (loading) {
    return <div className="empty">Loading…</div>
  }

  return (
    <div>
      <div className="section-head">
        <span className="eyebrow">No. 06</span>
        <h2 className="display display--lg">Open Loops</h2>
        <p className="lede">The decisions still in the air. Keep them here until each one is quietly resolved.</p>
      </div>

      {/* Add */}
      <div className="card">
        {showAddLoop ? (
          <>
            <div className="spread">
              <h3 className="card-title" style={{ marginBottom: 0 }}>Open a Loop</h3>
              <button className="btn-icon" onClick={() => setShowAddLoop(false)}><X /></button>
            </div>
            <div className="field mt-6">
              <input
                type="text"
                value={newLoopTitle}
                onChange={(e) => setNewLoopTitle(e.target.value)}
                placeholder="What decision needs closing?"
                className="input"
                onKeyDown={(e) => e.key === 'Enter' && addLoop()}
                autoFocus
              />
              <div className="cluster mt-6">
                <button onClick={addLoop} className="btn btn--primary btn--sm">Open Loop</button>
                <button onClick={() => setShowAddLoop(false)} className="btn btn--ghost btn--sm">Cancel</button>
              </div>
            </div>
          </>
        ) : (
          <button onClick={() => setShowAddLoop(true)} className="btn btn--ghost btn--block">
            <Plus size={15} /> Open a New Loop
          </button>
        )}
      </div>

      {/* Open */}
      <div className="card mt-6">
        <div className="spread card-title--tight">
          <h3 className="card-title" style={{ marginBottom: 0 }}>Open</h3>
          <span className="badge">{loops.length}</span>
        </div>
        <hr className="rule" />
        {loops.length === 0 ? (
          <p className="empty">Nothing open. All quiet.</p>
        ) : (
          <div className="rows">
            {loops.map((loop) => (
              <div key={loop.id} className={`row loop-row ${closingLoop === loop.id ? 'loop-row--closing' : ''}`}>
                <div>
                  <p className="row__title">{loop.title}</p>
                  <p className="row__meta">Opened by {loop.created_by}</p>
                </div>
                <div className="row__actions">
                  <button
                    onClick={() => closeLoop(loop.id)}
                    disabled={closingLoop === loop.id}
                    className="btn btn--accent btn--sm"
                  >
                    {closingLoop === loop.id ? 'Closing…' : 'Close'}
                  </button>
                  <button onClick={() => deleteLoop(loop.id)} className="btn btn--ghost btn--sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Closed */}
      {closedLoops.length > 0 && (
        <div className="card mt-6">
          <h3 className="card-title">Recently Closed</h3>
          <div className="rows">
            {closedLoops.map((loop) => (
              <div key={loop.id} className="row row--muted">
                <div>
                  <p className="row__title">{loop.title}</p>
                  <p className="row__meta">
                    Closed {loop.closed_at ? new Date(loop.closed_at).toLocaleDateString() : 'recently'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
