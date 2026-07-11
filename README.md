# Ruby & James - Weekly Check-in Website

A warm, sleek web app for Ruby and James to coordinate weekly check-ins, manage household tasks, plan date nights, and track daily self-care rituals with their baby Clara.

## Features

### 1. Task Wheel 🎡
Add larger chores/tasks throughout the week, spin a roulette wheel to randomly select which task to tackle that week, schedule it on a specific day, and confirm completion at the next check-in. Completed tasks are removed; incomplete tasks stay in the pool.

### 2. Weekly Self-Care 🧘
Each parent picks a screen-free self-care activity for the week and chooses the night. The other parent watches Clara during that time.

### 3. Intimacy/Connection Night 💑
Pick a night each week for at-home connection and quality time together.

### 4. Date Night / Hosting Events 🌙
Alternate weeks between:
- **Date Night** (odd weeks): One parent plans and arranges babysitting for Clara
- **Hosting Guests** (even weeks): One parent plans and hosts a meal (no babysitting needed)

### 5. Nightly Closing Shift ✅
Daily checklist for self-care rituals:
- Exercise/movement
- House reset
- Creatine & fish oil supplements
- Hydration

### 6. Open Loops 🔄
Add decisions/tasks, close them with a satisfying visual animation, and keep track of completed loops.

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Backend/Database**: Supabase (PostgreSQL + Auth)
- **Build Tool**: Vite
- **Styling**: Custom CSS with warm color palette

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kambotest/rubyssurprise.git
cd rubyssurprise
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Then edit `.env.local` with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Setting Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the database schema setup (see `database/schema.sql`)
3. Enable email/password authentication in Supabase
4. Copy your project URL and anon key to `.env.local`

### Development

Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Project Structure

```
rubyssurprise/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── lib/              # Utilities and Supabase client
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── index.html            # HTML template
├── package.json          # Dependencies
├── vite.config.ts        # Vite configuration
└── tsconfig.json         # TypeScript configuration
```

## Design

The app uses a warm, sleek design with:
- **Primary color**: Warm gold/orange (#d97706)
- **Secondary color**: Indigo (#6366f1)
- **Background**: Soft cream (#faf8f3)
- **Text**: Dark charcoal (#1f2937)

Typography and spacing are optimized for readability and a calming, welcoming feel.

## Database Schema

Key tables:
- `profiles` - User accounts (Ruby and James)
- `tasks` - Household chores/tasks
- `weekly_plans` - Weekly events and activities
- `nightly_checklist` - Daily self-care tracking
- `open_loops` - Decisions and tasks being tracked
- `self_care_activities` - Parent-specific self-care selections
- `connection_nights` - Intimacy/connection scheduling
- `date_nights` - Date night planning and tracking
- `hosting_events` - Guest hosting planning and tracking

## Authentication

The app uses Supabase Auth with email/password. Only Ruby and James can sign up and access the app (you can configure this in Supabase RLS policies).

## Real-Time Sync

The app uses Supabase Realtime to keep both parents' views in sync. Changes made by one parent appear instantly for the other.

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

## Deployment

The app is ready to deploy to:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- **Any static hosting**

See [Vite deployment docs](https://vitejs.dev/guide/static-deploy.html) for specific platforms.

## Future Enhancements

- Photo/memory attachments to events
- Notification reminders (email/SMS)
- Historical analytics and trends
- Voice notes for open loops
- Calendar integration (Google Calendar)
- Mobile app (React Native)
- Family sharing for extended family updates

## Contributing

This is a personal project for Ruby and James. Feature requests and bug reports are welcome!

## License

MIT
