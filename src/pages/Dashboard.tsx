import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useWeek } from '../context/WeekContext'
import { useAuth } from '../context/AuthContext'
import { formatDate } from '../lib/utils'
import TaskWheel from '../components/TaskWheel'
import SelfCareForm from '../components/SelfCareForm'
import ConnectionNight from '../components/ConnectionNight'
import DateNightHosting from '../components/DateNightHosting'
import OpenLoops from '../components/OpenLoops'
import WeeklySummary from '../components/WeeklySummary'
import './Dashboard.css'

type PageType = 'dashboard' | 'taskwheel' | 'selfcare' | 'connection' | 'datenighthosting' | 'openloops'

interface DashboardProps {
  currentPage: PageType
  onNavigate: (page: PageType) => void
}

type CompletedFeatures = Set<PageType>

const INDEX: { key: PageType; no: string; title: string; note: string }[] = [
  { key: 'taskwheel', no: '01', title: 'The Task Wheel', note: 'Draw a household chore at random and set its day.' },
  { key: 'selfcare', no: '02', title: 'Independent Free Time', note: 'A weekly ritual for each of you, while the other keeps Clara.' },
  { key: 'connection', no: '03', title: 'Deeper Intimacy Night', note: 'An evening reserved for time together, at home.' },
  { key: 'datenighthosting', no: '04', title: 'Evenings Out & In', note: 'Alternating weeks — a night out, or a table for guests.' },
  { key: 'openloops', no: '05', title: 'Open Loops', note: 'Decisions still in the air, tracked until resolved.' },
]

function Subview({ onBack, children }: { onBack: () => void; children: ReactNode }) {
  return (
    <div className="container view">
      <button className="back-link" onClick={onBack}>
        <ArrowLeft /> Back to Index
      </button>
      {children}
    </div>
  )
}

export default function Dashboard({ currentPage, onNavigate }: DashboardProps) {
  const { weekStart, weekEnd, weekStartString, isOdd, goToPreviousWeek, goToNextWeek, goToCurrentWeek } = useWeek()
  const { parent } = useAuth()
  const [completedFeatures, setCompletedFeatures] = useState<CompletedFeatures>(new Set())
  const [showSummary, setShowSummary] = useState(false)

  useEffect(() => {
    // Restore which features already have saved data for this week
    const completed = new Set<PageType>()

    const selfCare = JSON.parse(localStorage.getItem('rubyssurprise_selfcare') || '{}')
    if (selfCare[weekStartString]) completed.add('selfcare')

    const connection = JSON.parse(localStorage.getItem('rubyssurprise_connection') || '{}')
    if (connection[weekStartString]) completed.add('connection')

    const dateNight = JSON.parse(localStorage.getItem('rubyssurprise_datenighthosting') || '{}')
    if (dateNight[weekStartString]) completed.add('datenighthosting')

    setCompletedFeatures(completed)
  }, [weekStartString])

  if (!parent) {
    return <div className="container view text-center">Loading…</div>
  }

  const otherParent = parent === 'ruby' ? 'james' : 'ruby'
  const allFeaturesComplete = completedFeatures.size === 5

  const handleNavigate = (page: PageType) => {
    setCompletedFeatures(prev => new Set([...prev, page]))
    onNavigate(page)
  }

  const back = () => {
    setShowSummary(false)
    onNavigate('dashboard')
  }

  if (currentPage === 'taskwheel') {
    return <Subview onBack={back}><TaskWheel weekStart={weekStartString} currentUser={parent} /></Subview>
  }
  if (currentPage === 'selfcare') {
    return <Subview onBack={back}><SelfCareForm weekStart={weekStartString} parent={parent} otherParent={otherParent as any} /></Subview>
  }
  if (currentPage === 'connection') {
    return <Subview onBack={back}><ConnectionNight weekStart={weekStartString} /></Subview>
  }
  if (currentPage === 'datenighthosting') {
    return <Subview onBack={back}><DateNightHosting weekStart={weekStartString} isOddWeek={isOdd} planner={parent} otherParent={otherParent as any} /></Subview>
  }
  if (currentPage === 'openloops') {
    return (
      <>
        <Subview onBack={back}><OpenLoops currentUser={parent} /></Subview>
        {allFeaturesComplete && (
          <WeeklySummary
            isOpen={showSummary || allFeaturesComplete}
            onClose={() => setShowSummary(false)}
            onEdit={(feature) => handleNavigate(feature as PageType)}
            weekStart={weekStartString}
          />
        )}
      </>
    )
  }

  // Index (dashboard)
  return (
    <div className="container view">
      <div className="dash-hero">
        <div>
          <span className="eyebrow">The Week Ahead</span>
          <h1 className="display display--xl dash-hero__title">Weekly Check-In</h1>
          <p className="dash-hero__dates">
            {formatDate(weekStart)} &nbsp;—&nbsp; {formatDate(weekEnd)}
          </p>
          <span className="badge badge--accent dash-hero__mode">
            {isOdd ? 'Date Night Week' : 'Hosting Week'}
          </span>
        </div>

        <div className="weeknav">
          <button className="btn-icon" onClick={goToPreviousWeek} aria-label="Previous week"><ChevronLeft /></button>
          <button className="btn btn--ghost btn--sm" onClick={goToCurrentWeek}>This Week</button>
          <button className="btn-icon" onClick={goToNextWeek} aria-label="Next week"><ChevronRight /></button>
        </div>
      </div>

      <hr className="rule dash-rule" />

      <div className="index-list">
        {INDEX.map((item) => {
          const label = item.key === 'datenighthosting'
            ? 'Date Night / Hosting'
            : item.title
          return (
            <button key={item.key} className="index-item" onClick={() => handleNavigate(item.key)}>
              <span className="index-item__no">{item.no}</span>
              <span className="index-item__body">
                <span className="index-item__title">{label}</span>
                <span className="index-item__note">{item.note}</span>
              </span>
              <span className="index-item__arrow"><ArrowUpRight /></span>
            </button>
          )
        })}
      </div>

    </div>
  )
}
