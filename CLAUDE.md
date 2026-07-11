# Ruby's Surprise - Weekly Check-In App

## Project Overview

A warm, sleek web application for Ruby and James to coordinate weekly check-ins, manage household tasks, plan date nights, and track daily self-care rituals with their baby Clara.

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Backend/Database**: Supabase (PostgreSQL + Auth + Realtime)
- **Styling**: Custom CSS with warm color palette
- **Deployment Ready**: Vercel, Netlify, or any static host

## Project Structure

```
src/
├── components/          # Reusable feature components
│   ├── TaskWheel.tsx   # Task wheel spinner component
│   ├── SelfCareForm.tsx # Self-care planning
│   ├── ConnectionNight.tsx # Intimacy/connection scheduling
│   ├── DateNightHosting.tsx # Date night & hosting planner
│   ├── NightlyClosing.tsx # Daily checklist tracking
│   ├── OpenLoops.tsx    # Decision tracking with closing animation
│   └── *.css            # Component-specific styles
├── context/
│   ├── AuthContext.tsx  # Authentication state & user management
│   └── WeekContext.tsx  # Week navigation & odd/even detection
├── pages/
│   └── Dashboard.tsx    # Main dashboard with navigation
├── lib/
│   ├── supabase.ts      # Supabase client & types
│   └── utils.ts         # Date utilities, week helpers
├── types/
│   └── index.ts         # TypeScript type definitions
├── App.tsx              # Root component with providers
├── App.css              # Global utility styles
├── index.css            # Reset & theme variables
└── main.tsx             # Entry point
```

## Key Features

### 1. Task Wheel 🎡
- Add household chores/tasks throughout the week
- Spin interactive SVG wheel to randomly select task
- Schedule selected task on specific date
- Confirm completion at next check-in
- Completed tasks removed, incomplete stay in pool
- **File**: `src/components/TaskWheel.tsx`

### 2. Self-Care (Screen-Free) 🧘
- Each parent selects unique screen-free activity
- Choose which night for their activity
- Other parent watches Clara during that time
- Weekly calendar view shows both schedules
- **File**: `src/components/SelfCareForm.tsx`

### 3. Intimacy/Connection Night 💑
- Pick a night each week for at-home connection
- Suggestions: movies, massage, yoga, reading together
- Store notes and memories
- View past connection nights
- **File**: `src/components/ConnectionNight.tsx`

### 4. Date Night / Hosting (Alternating Weeks) 🌙
**Odd weeks**: Date Night
- One parent plans and arranges babysitter
- Track babysitter info, location, time
- Add notes for special touches

**Even weeks**: Hosting Guests
- One parent plans meal with guests
- Track guest list and menu
- No babysitter needed for Clara
- **File**: `src/components/DateNightHosting.tsx`

### 5. Nightly Closing Shift ✅
- Daily checklist with 4 items:
  - 🏃 Exercise/movement
  - 🏠 House reset
  - 💊 Creatine & fish oil
  - 💧 Hydration
- Weekly view with date selector
- Completion percentage tracking
- Celebration message when all complete
- **File**: `src/components/NightlyClosing.tsx`

### 6. Open Loops 🔄
- Add decisions/tasks that need tracking
- Smooth loop-closing animation on completion
- Archive of recently closed loops
- Visual priority and completion status
- **File**: `src/components/OpenLoops.tsx`

## Authentication

- **Provider**: Supabase Auth (email/password)
- **Users**: Only Ruby and James (customizable)
- **Session**: JWT tokens with refresh
- **Security**: Row Level Security (RLS) policies on Supabase

## State Management

- **AuthContext**: User session, parent identification
- **WeekContext**: Current week, week navigation, odd/even detection
- **Component State**: React `useState` for local UI state
- **Database**: Supabase for persistent data

## Color Palette

| Use | Color | Hex |
|-----|-------|-----|
| Primary | Warm Gold/Orange | #d97706 |
| Secondary | Indigo | #6366f1 |
| Background | Soft Cream | #faf8f3 |
| Text | Dark Charcoal | #1f2937 |
| Success | Emerald | #10b981 |

Feature-specific colors:
- Task Wheel: Orange (#f59e0b)
- Self-Care: Indigo (#6366f1)
- Connection: Rose (#f43f5e)
- Date Night: Emerald (#10b981)
- Hosting: Orange (#f97316)
- Nightly Closing: Blue (#3b82f6)
- Open Loops: Yellow (#eab308)

## Database Schema

### Tables
- `profiles` - User accounts (Ruby, James)
- `tasks` - Chores/tasks with completion tracking
- `weekly_plans` - Weekly event scheduling
- `nightly_checklist` - Daily ritual tracking
- `open_loops` - Decisions being tracked
- `self_care_activities` - Parent-specific self-care
- `connection_nights` - Intimacy scheduling
- `date_nights` - Date night planning
- `hosting_events` - Guest hosting planning

## Development

### Setup
```bash
npm install
cp .env.example .env.local
# Add Supabase credentials to .env.local
```

### Running Locally
```bash
npm run dev
```

### Type Checking
```bash
npm run type-check
```

### Building
```bash
npm run build
```

## Deployment

### Supabase Setup
1. Create project at supabase.com
2. Enable email/password auth
3. Configure RLS policies
4. Get project URL and anon key
5. Add to `.env.local`

### Vercel Deployment
1. Connect GitHub repo
2. Set environment variables
3. Deploy

## Week Detection Logic

Week parity is used to determine if current week is date night or hosting:
- **Odd weeks (1, 3, 5...)**: Date night with babysitter
- **Even weeks (2, 4, 6...)**: Hosting guests

Determined by:
```typescript
const weekNumber = getWeekNumber(date)
const isOddWeek = weekNumber % 2 === 1
```

## Future Enhancements

- Photo/memory attachments to events
- Notification reminders (email/SMS)
- Historical analytics dashboard
- Voice notes for open loops
- Calendar integration (Google Calendar)
- Mobile app (React Native)
- Guest mode for babysitter reference
- Family blog/shared journal
- Task difficulty levels
- Reward system for consistency

## Important Notes

- The app uses Supabase's real-time subscriptions for live sync between Ruby and James
- Date calculations use Monday as week start
- Week navigation is handled by WeekContext
- All user data is private to Ruby and James (configured via RLS policies)
- Clara's care arrangements are tracked for context but Clara doesn't have a login

## Troubleshooting

### Build Issues
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf dist`

### Supabase Connection
- Verify `.env.local` has correct credentials
- Check Supabase project status
- Ensure RLS policies allow authenticated users

### Styling Issues
- Check CSS variables in `src/index.css`
- Ensure Tailwind/custom CSS are imported
- Clear browser cache

## Contributing

This is a personal project for Ruby and James. Development is ongoing!
