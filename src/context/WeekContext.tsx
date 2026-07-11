import { createContext, useContext, useState } from 'react'
import { getWeekStart, isOddWeek, getDateString, addDays } from '../lib/utils'

interface WeekContextType {
  weekStart: Date
  weekEnd: Date
  weekStartString: string
  isOdd: boolean
  goToPreviousWeek: () => void
  goToNextWeek: () => void
  goToCurrentWeek: () => void
}

const WeekContext = createContext<WeekContextType | undefined>(undefined)

export function WeekProvider({ children }: { children: React.ReactNode }) {
  const [weekStart, setWeekStart] = useState(() => getWeekStart())
  const weekEnd = addDays(weekStart, 6)
  const isOdd = isOddWeek(weekStart)
  const weekStartString = getDateString(weekStart)

  const goToPreviousWeek = () => {
    setWeekStart(prev => addDays(prev, -7))
  }

  const goToNextWeek = () => {
    setWeekStart(prev => addDays(prev, 7))
  }

  const goToCurrentWeek = () => {
    setWeekStart(getWeekStart())
  }

  return (
    <WeekContext.Provider
      value={{
        weekStart,
        weekEnd,
        weekStartString,
        isOdd,
        goToPreviousWeek,
        goToNextWeek,
        goToCurrentWeek,
      }}
    >
      {children}
    </WeekContext.Provider>
  )
}

export function useWeek() {
  const context = useContext(WeekContext)
  if (!context) {
    throw new Error('useWeek must be used within WeekProvider')
  }
  return context
}
