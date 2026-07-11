// Local-only Supabase-like client for offline functionality
import { localDb } from './localStorage'

export const supabase = {
  auth: localDb.auth,
  from: (table: string) => ({
    select: (fields?: string) => ({
      eq: (field: string, value: any) => ({
        gte: (field2: string, value2: any) => ({
          lte: (field3: string, value3: any) => ({
            order: () => localDb[table as keyof typeof localDb].select(),
          }),
          order: () => localDb[table as keyof typeof localDb].select(),
        }),
        lte: (field2: string, value2: any) => ({
          order: () => localDb[table as keyof typeof localDb].select(),
        }),
        not: () => localDb[table as keyof typeof localDb].select(),
        is: () => localDb[table as keyof typeof localDb].select(),
      }),
      gte: (field: string, value: any) => ({
        lte: (field2: string, value2: any) => localDb[table as keyof typeof localDb].select(),
      }),
      order: () => localDb[table as keyof typeof localDb].select(),
    }),
    insert: (records: any[]) => ({
      select: () => localDb[table as keyof typeof localDb].insert(records),
    }),
    update: (record: any) => ({
      eq: (field: string, value: any) => {
        const matching = (localDb[table as keyof typeof localDb] as any)
        if (matching) {
          return matching.update(record, value)
        }
        return { error: null }
      },
    }),
    delete: () => ({
      eq: (field: string, value: any) => {
        const matching = (localDb[table as keyof typeof localDb] as any)
        if (matching) {
          return matching.delete(value)
        }
        return { error: null }
      },
    }),
  }),
}

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
