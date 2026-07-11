import { useState } from 'react'
import { User, DAYS_OF_WEEK } from '../types'
import { OTHER_PARENT } from '../types'
import { showToast } from '../lib/validation'
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

  const handleSave = () => {
    if (!selectedNight) {
      showToast('Please choose a night', 'error')
      return
    }
    showToast(isOddWeek ? 'Date night saved' : 'Hosting saved', 'success')
  }

  const plannerName = OTHER_PARENT[otherParent] === 'ruby' ? 'Ruby' : 'James'
  const weekendDays = DAYS_OF_WEEK.slice(4, 7)

  return (
    <div>
      {isOddWeek ? (
        <>
          <div className="section-head">
            <span className="eyebrow">No. 04 · Odd Week</span>
            <h2 className="display display--lg">An Evening Out</h2>
            <p className="lede">A night reserved for the two of you — the sitter arranged, Clara well looked after.</p>
            {planner === otherParent && (
              <span className="badge badge--accent">{plannerName} is planning this one</span>
            )}
          </div>

          <div className="grid-2 grid-2--wide">
            <div className="card">
              <h3 className="card-title">The Details</h3>

              <div className="field">
                <label className="label">Which night</label>
                <div className="choice-grid choice-grid--3">
                  {weekendDays.map((day) => (
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

              <div className="field">
                <label className="label">Where / what</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="A restaurant, a trail, a film…"
                  className="input"
                />
              </div>

              <div className="field">
                <label className="label">Sitter</label>
                <input
                  type="text"
                  value={babysitter}
                  onChange={(e) => setBabysitter(e.target.value)}
                  placeholder="Name & number"
                  className="input"
                />
              </div>

              <div className="field">
                <label className="label">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Reservation time, what to wear, quiet surprises…"
                  rows={3}
                  className="textarea"
                />
              </div>

              <button onClick={handleSave} className="btn btn--primary btn--block">Save the Evening</button>
            </div>

            <div className="card card--raised">
              <h3 className="card-title">The Evening</h3>
              {selectedNight ? (
                <>
                  <div className="panel"><p className="panel__label">Night</p><p className="panel__value">{selectedNight}</p></div>
                  {location && <div className="panel mt-6"><p className="panel__label">Where</p><p className="panel__value">{location}</p></div>}
                  {babysitter && <div className="panel mt-6"><p className="panel__label">Sitter</p><p className="panel__value">{babysitter}</p></div>}
                  <div className="panel panel--positive mt-6">Clara is looked after.</div>
                </>
              ) : (
                <p className="empty">Choose a night to begin.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="section-head">
            <span className="eyebrow">No. 04 · Even Week</span>
            <h2 className="display display--lg">A Table at Home</h2>
            <p className="lede">Guests, a considered menu, and no sitter needed — Clara stays home with you.</p>
            {planner === otherParent && (
              <span className="badge badge--accent">{plannerName} is hosting this one</span>
            )}
          </div>

          <div className="grid-2 grid-2--wide">
            <div className="card">
              <h3 className="card-title">The Details</h3>

              <div className="field">
                <label className="label">Which night</label>
                <div className="choice-grid choice-grid--3">
                  {weekendDays.map((day) => (
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

              <div className="field">
                <label className="label">Guests</label>
                <textarea
                  value={guestsList}
                  onChange={(e) => setGuestsList(e.target.value)}
                  placeholder="Who is coming…"
                  rows={3}
                  className="textarea"
                />
              </div>

              <div className="field">
                <label className="label">Menu</label>
                <textarea
                  value={menu}
                  onChange={(e) => setMenu(e.target.value)}
                  placeholder="Mains, sides, something sweet, drinks…"
                  rows={3}
                  className="textarea"
                />
              </div>

              <div className="field">
                <label className="label">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Prep time, dietary notes, music…"
                  rows={2}
                  className="textarea"
                />
              </div>

              <button onClick={handleSave} className="btn btn--primary btn--block">Save the Table</button>
            </div>

            <div className="card card--raised">
              <h3 className="card-title">The Table</h3>
              {selectedNight ? (
                <>
                  <div className="panel"><p className="panel__label">Night</p><p className="panel__value">{selectedNight}</p></div>
                  {guestsList && (
                    <div className="panel mt-6">
                      <p className="panel__label">Guests</p>
                      <div className="guest-list">
                        {guestsList.split('\n').filter(Boolean).map((g, i) => (
                          <span key={i} className="guest-list__name">{g.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {menu && <div className="panel mt-6"><p className="panel__label">Menu</p><p className="panel__value" style={{ fontSize: '0.95rem' }}>{menu}</p></div>}
                  <div className="panel panel--positive mt-6">No sitter needed.</div>
                </>
              ) : (
                <p className="empty">Choose a night to begin.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
