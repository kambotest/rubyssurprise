import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          username: string
          email: string
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          created_by: string
          created_at: string
          scheduled_date: string | null
          completed: boolean
          completed_date: string | null
        }
        Insert: {
          id?: string
          title: string
          created_by: string
          scheduled_date?: string | null
          completed?: boolean
          completed_date?: string | null
        }
      }
      weekly_plans: {
        Row: {
          id: string
          week_start: string
          self_care_ruby: string | null
          self_care_ruby_day: string | null
          self_care_james: string | null
          self_care_james_day: string | null
          intimacy_night: string | null
          date_night_planner: 'ruby' | 'james'
          date_night_night: string | null
          date_night_babysitter: string | null
          hosting_guests_planner: 'ruby' | 'james'
          hosting_guests_night: string | null
          hosting_guests_list: string | null
          created_at: string
        }
        Insert: {
          id?: string
          week_start: string
          self_care_ruby?: string | null
          self_care_ruby_day?: string | null
          self_care_james?: string | null
          self_care_james_day?: string | null
          intimacy_night?: string | null
          date_night_planner?: 'ruby' | 'james'
          date_night_night?: string | null
          date_night_babysitter?: string | null
          hosting_guests_planner?: 'ruby' | 'james'
          hosting_guests_night?: string | null
          hosting_guests_list?: string | null
          created_at?: string
        }
      }
      nightly_checklist: {
        Row: {
          id: string
          user: 'ruby' | 'james'
          date: string
          exercise: boolean
          house_reset: boolean
          supplements: boolean
          hydration: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user: 'ruby' | 'james'
          date: string
          exercise?: boolean
          house_reset?: boolean
          supplements?: boolean
          hydration?: boolean
          created_at?: string
        }
      }
      open_loops: {
        Row: {
          id: string
          title: string
          created_by: string
          created_at: string
          closed_at: string | null
        }
        Insert: {
          id?: string
          title: string
          created_by: string
          closed_at?: string | null
        }
      }
    }
  }
}
