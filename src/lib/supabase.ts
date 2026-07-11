// Local-only, Supabase-compatible client backed by browser localStorage.
// Implements just enough of the query-builder surface the app uses:
//   .select().eq().gte().lte().is().not().order().limit().single()
//   .insert().select()
//   .update().eq()
//   .delete().eq()
// The builder is awaitable (thenable) and resolves to { data, error }.
import { localDb } from './localStorage'

const STORAGE_KEY = 'rubyssurprise_data'

// Component table names (snake_case) → localStorage keys.
const TABLE_MAP: Record<string, string> = {
  tasks: 'tasks',
  weekly_plans: 'weeklyPlans',
  nightly_checklist: 'nightlyChecklist',
  open_loops: 'openLoops',
}

type Row = Record<string, any>
type Result = { data: any; error: any }

function readAll(): Record<string, any> {
  const empty = { tasks: [], weeklyPlans: [], nightlyChecklist: [], openLoops: [], authSession: null }
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return { ...empty }
  try {
    return { ...empty, ...JSON.parse(raw) }
  } catch {
    return { ...empty }
  }
}

function writeAll(data: Record<string, any>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function genId(): string {
  return Math.random().toString(36).slice(2, 11)
}

class QueryBuilder implements PromiseLike<Result> {
  private key: string
  private filters: ((row: Row) => boolean)[] = []
  private op: 'select' | 'insert' | 'update' | 'delete' = 'select'
  private payload: any = null
  private orderField: string | null = null
  private orderAsc = true
  private limitN: number | null = null
  private singleRow = false

  constructor(table: string) {
    this.key = TABLE_MAP[table] ?? table
  }

  select(_fields?: string) {
    if (this.op !== 'insert') this.op = 'select'
    return this
  }
  insert(records: Row[]) { this.op = 'insert'; this.payload = records; return this }
  update(record: Row) { this.op = 'update'; this.payload = record; return this }
  delete() { this.op = 'delete'; return this }

  eq(field: string, value: any) { this.filters.push((r) => r[field] === value); return this }
  gte(field: string, value: any) { this.filters.push((r) => r[field] >= value); return this }
  lte(field: string, value: any) { this.filters.push((r) => r[field] <= value); return this }
  is(field: string, value: any) { this.filters.push((r) => r[field] === value); return this }
  not(field: string, _operator: string, value: any) { this.filters.push((r) => r[field] !== value); return this }
  order(field: string, opts?: { ascending?: boolean }) {
    this.orderField = field
    this.orderAsc = opts?.ascending !== false
    return this
  }
  limit(n: number) { this.limitN = n; return this }
  single() { this.singleRow = true; return this }

  private matches(row: Row): boolean {
    return this.filters.every((f) => f(row))
  }

  private run(): Result {
    const all = readAll()
    const rows: Row[] = Array.isArray(all[this.key]) ? all[this.key] : []

    if (this.op === 'insert') {
      const created = (this.payload as Row[]).map((r) => ({
        ...r,
        id: r.id || genId(),
        created_at: r.created_at || new Date().toISOString(),
      }))
      all[this.key] = [...rows, ...created]
      writeAll(all)
      return { data: this.singleRow ? created[0] ?? null : created, error: null }
    }

    if (this.op === 'update') {
      const updated: Row[] = []
      all[this.key] = rows.map((r) => {
        if (this.matches(r)) {
          const next = { ...r, ...this.payload }
          updated.push(next)
          return next
        }
        return r
      })
      writeAll(all)
      return { data: this.singleRow ? updated[0] ?? null : updated, error: null }
    }

    if (this.op === 'delete') {
      all[this.key] = rows.filter((r) => !this.matches(r))
      writeAll(all)
      return { data: null, error: null }
    }

    // select
    let result = rows.filter((r) => this.matches(r))
    if (this.orderField) {
      const field = this.orderField
      const dir = this.orderAsc ? 1 : -1
      result = [...result].sort((a, b) => {
        const av = a[field]
        const bv = b[field]
        if (av === bv) return 0
        if (av == null) return 1
        if (bv == null) return -1
        return (av < bv ? -1 : 1) * dir
      })
    }
    if (this.limitN != null) result = result.slice(0, this.limitN)
    return { data: this.singleRow ? result[0] ?? null : result, error: null }
  }

  then<TResult1 = Result, TResult2 = never>(
    onfulfilled?: ((value: Result) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {
    let settled: Result
    try {
      settled = this.run()
    } catch (error) {
      settled = { data: null, error }
    }
    return Promise.resolve(settled).then(onfulfilled, onrejected)
  }
}

export const supabase = {
  auth: localDb.auth,
  from: (table: string) => new QueryBuilder(table),
}
