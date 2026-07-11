export type User = 'ruby' | 'james'

export interface Profile {
  id: string
  username: string
  email: string
  created_at: string
}

export interface Task {
  id: string
  title: string
  created_by: User
  created_at: string
  scheduled_date: string | null
  completed: boolean
  completed_date: string | null
}

export interface WeeklyPlan {
  id: string
  week_start: string
  self_care_ruby: string | null
  self_care_ruby_day: string | null
  self_care_james: string | null
  self_care_james_day: string | null
  intimacy_night: string | null
  date_night_planner: User
  date_night_night: string | null
  date_night_babysitter: string | null
  hosting_guests_planner: User
  hosting_guests_night: string | null
  hosting_guests_list: string | null
  created_at: string
}

export interface NightlyChecklist {
  id: string
  user: User
  date: string
  exercise: boolean
  house_reset: boolean
  supplements: boolean
  hydration: boolean
  created_at: string
}

export interface OpenLoop {
  id: string
  title: string
  created_by: User
  created_at: string
  closed_at: string | null
}

export interface DayOfWeek {
  name: string
  short: string
  num: number
}

export const DAYS_OF_WEEK: DayOfWeek[] = [
  { name: 'Monday', short: 'Mon', num: 1 },
  { name: 'Tuesday', short: 'Tue', num: 2 },
  { name: 'Wednesday', short: 'Wed', num: 3 },
  { name: 'Thursday', short: 'Thu', num: 4 },
  { name: 'Friday', short: 'Fri', num: 5 },
  { name: 'Saturday', short: 'Sat', num: 6 },
  { name: 'Sunday', short: 'Sun', num: 0 },
]

export const OTHER_PARENT: Record<User, User> = {
  ruby: 'james',
  james: 'ruby',
}
