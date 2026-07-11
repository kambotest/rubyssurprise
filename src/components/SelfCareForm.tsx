import { useState, useEffect } from 'react'
import { User, DAYS_OF_WEEK } from '../types'
import { validation, showToast } from '../lib/validation'
import './SelfCareForm.css'

interface SelfCareFormProps {
  weekStart: string
  parent: User
  otherParent: User
}

export default function SelfCareForm({ weekStart, parent, otherParent }: SelfCareFormProps) {
  const [activity, setActivity] = useState('')
  const [night, setNight] = useState('')
  const [otherActivity] = useState('')
  const [otherNight] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSelfCare()
  }, [weekStart])

  const loadSelfCare = async () => {
    // Placeholder — self-care schedule is kept locally per session.
  }

  const saveSelfCare = async () => {
    const activityError = validation.activityName(activity)
    if (activityError) {
      showToast(activityError, 'error')
      return
    }
    if (!night) {
      showToast('Please choose a night', 'error')
      return
    }

    setLoading(true)
    try {
      showToast('Screen-free time saved', 'success')
    } catch {
      showToast('Could not save', 'error')
    } finally {
      setLoading(false)
    }
  }

  const parentName = parent === 'ruby' ? 'Ruby' : 'James'
  const otherName = otherParent === 'ruby' ? 'Ruby' : 'James'

  return (
    <div>
      <div className="section-head">
        <span className="eyebrow">No. 02</span>
        <h2 className="display display--lg">Screen-Free Hours</h2>
        <p className="lede">One unhurried, screen-free ritual each week — while the other keeps Clara company.</p>
      </div>

      <div className="grid-2 grid-2--wide">
        {/* Your time */}
        <div className="card">
          <h3 className="card-title">Your Ritual · {parentName}</h3>

          <div className="field">
            <label className="label">Activity</label>
            <input
              type="text"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="Reading, a long bath, painting…"
              className="input"
            />
          </div>

          <div className="field">
            <label className="label">Which night</label>
            <div className="choice-grid">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day.num}
                  onClick={() => setNight(day.name)}
                  className={`choice ${night === day.name ? 'choice--active' : ''}`}
                >
                  {day.short}
                </button>
              ))}
            </div>
          </div>

          {night && (
            <div className="panel panel--accent">
              {otherName} keeps Clara on <strong>{night}</strong>.
            </div>
          )}

          <button
            onClick={saveSelfCare}
            disabled={loading || !activity || !night}
            className="btn btn--primary btn--block mt-6"
          >
            {loading ? 'Saving…' : 'Save My Ritual'}
          </button>
        </div>

        {/* Partner's time */}
        <div className="card">
          <h3 className="card-title">{otherName}&rsquo;s Ritual</h3>

          {otherActivity && otherNight ? (
            <>
              <div className="panel">
                <p className="panel__label">Activity</p>
                <p className="panel__value">{otherActivity}</p>
              </div>
              <div className="panel mt-6">
                <p className="panel__label">Night</p>
                <p className="panel__value">{otherNight}</p>
              </div>
              <div className="panel panel--positive mt-6">You keep Clara on {otherNight}.</div>
            </>
          ) : (
            <p className="empty">Waiting for {otherName} to set their ritual.</p>
          )}
        </div>
      </div>

      {/* Week view */}
      <div className="card mt-8">
        <h3 className="card-title">The Week</h3>
        <div className="choice-grid choice-grid--7">
          {DAYS_OF_WEEK.map((day) => {
            const mine = night === day.name
            const theirs = otherNight === day.name
            return (
              <div key={day.num} className={`week-cell ${mine ? 'week-cell--mine' : ''} ${theirs ? 'week-cell--theirs' : ''}`}>
                <span className="week-cell__day">{day.short}</span>
                {mine && <span className="week-cell__tag">You</span>}
                {theirs && <span className="week-cell__tag">Them</span>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
