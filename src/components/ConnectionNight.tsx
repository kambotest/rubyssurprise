import { useState } from 'react'
import { DAYS_OF_WEEK } from '../types'
import { showToast } from '../lib/validation'
import './ConnectionNight.css'

interface ConnectionNightProps {
  weekStart: string
}

const IDEAS = [
  { title: 'A Film at Home', desc: 'Choose something together and settle in.' },
  { title: 'A Considered Dinner', desc: 'Cook side by side, or order in something good.' },
  { title: 'Unhurried Massage', desc: 'Twenty quiet minutes for each other.' },
  { title: 'An Evening Walk', desc: 'Leave the phones; take the long way.' },
  { title: 'Stretch & Breathe', desc: 'Gentle yoga or a short meditation together.' },
  { title: 'Read Aloud', desc: 'A few pages of something, side by side.' },
]

const PAST = [
  { date: 'Saturday, 5 July', note: 'A film and fresh popcorn.' },
  { date: 'Friday, 28 June', note: 'A walk through the park, then ice cream.' },
]

export default function ConnectionNight({}: ConnectionNightProps) {
  const [selectedNight, setSelectedNight] = useState('')
  const [notes, setNotes] = useState('')

  const save = () => {
    if (!selectedNight) {
      showToast('Please choose a night', 'error')
      return
    }
    showToast('Connection night saved', 'success')
  }

  return (
    <div>
      <div className="section-head">
        <span className="eyebrow">No. 03</span>
        <h2 className="display display--lg">Connection Night</h2>
        <p className="lede">One evening set aside — no errands, no screens by default. Just the two of you.</p>
      </div>

      <div className="grid-2 grid-2--wide">
        {/* Plan */}
        <div className="card">
          <h3 className="card-title">Reserve the Evening</h3>

          <div className="field">
            <label className="label">Which night</label>
            <div className="choice-grid">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day.num}
                  onClick={() => setSelectedNight(day.name)}
                  className={`choice ${selectedNight === day.name ? 'choice--active' : ''}`}
                >
                  {day.short}
                </button>
              ))}
            </div>
          </div>

          {selectedNight && (
            <div className="panel panel--accent">Reserved for <strong>{selectedNight}</strong>.</div>
          )}

          <div className="field mt-6">
            <label className="label">Notes &amp; intentions</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What would make the evening feel like a treat?"
              rows={4}
              className="textarea"
            />
          </div>

          <button onClick={save} disabled={!selectedNight} className="btn btn--primary btn--block">
            Save the Night
          </button>
        </div>

        {/* Ideas */}
        <div className="card">
          <h3 className="card-title">A Few Ideas</h3>
          <div className="stack-md">
            {IDEAS.map((idea) => (
              <div key={idea.title} className="suggestion">
                <p className="suggestion__title">{idea.title}</p>
                <p className="suggestion__desc">{idea.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Past */}
      <div className="card mt-8">
        <h3 className="card-title">Recent Evenings</h3>
        <div className="rows">
          {PAST.map((p) => (
            <div key={p.date} className="row">
              <div>
                <p className="row__title">{p.note}</p>
                <p className="row__meta">{p.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
