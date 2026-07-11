# Ruby & James - Weekly Check-in Website

A warm, sleek **local-only web app** for Ruby and James to coordinate weekly check-ins, manage household tasks, plan date nights, and track daily self-care rituals with their baby Clara.

🖥️ **Offline-First** • 💾 **Browser-Based Storage** • 🔒 **Private & Secure** • ⚡ **No Setup Required**

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
- **Storage**: Browser localStorage (offline-first)
- **Authentication**: Demo mode (hardcoded credentials)
- **Build Tool**: Vite
- **Styling**: Custom CSS with warm color palette

**No backend, no server, no internet required!**

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation (Super Simple!)

1. Clone the repository:
```bash
git clone https://github.com/kambotest/rubyssurprise.git
cd rubyssurprise
```

2. Install dependencies:
```bash
npm install
```

3. **That's it!** No environment variables or setup needed.

### Running Locally

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Demo Login

When prompted, use either:
- **Email:** `ruby@localhost`
- **Password:** any password

Or:
- **Email:** `james@localhost`
- **Password:** any password

Your data is automatically saved to browser storage and persists across sessions!

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

## Data Storage

All data is stored in **browser localStorage** (no database required):
- `tasks` - Household chores/tasks
- `weekly_plans` - Weekly events and activities
- `nightly_checklist` - Daily self-care tracking
- `open_loops` - Decisions and tasks being tracked
- `authSession` - Demo login session

Data is automatically saved after each change and persists across browser sessions.

## Authentication

The app uses **hardcoded demo authentication** for local use:
- **ruby@localhost** - Demo account for Ruby
- **james@localhost** - Demo account for James
- **Any password** works for both accounts

This is perfect for local-only use. All data is stored in your browser's localStorage.

## Data Sync

Since this is a local-only app for one machine, data syncs within your browser immediately. If you want to use it on multiple devices, you can:
1. Export your data using browser dev tools
2. Clear browser storage to reset
3. Share the same computer/browser for both accounts

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

## Running Locally

This app is designed to run locally on your machine, not on the internet.

To run it:
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

**Note:** If you want to share this app with others or run it on a server, you would need to:
1. Replace the localStorage backend with a real database (Supabase, PostgreSQL, etc.)
2. Implement proper authentication
3. Add data sync for multiple devices
4. Deploy to a web server

For now, it's perfect for local use!

## Troubleshooting

### Login Issues
- Use `ruby@localhost` or `james@localhost` as email
- Password can be anything
- If stuck on login screen, check browser console for errors (F12)

### Data Not Saving
- Check browser localStorage is enabled
- Try opening the app in an incognito/private window to test
- Clear browser cache if data seems lost (Cmd+Shift+R or Ctrl+Shift+R)

### Build Issues
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf dist`

### Reset All Data
To clear all saved data and start fresh:
1. Open browser DevTools (F12)
2. Go to Application → LocalStorage
3. Find `rubyssurprise_data` and delete it
4. Refresh the page

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
