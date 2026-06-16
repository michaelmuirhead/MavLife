# Lifespan

A life simulator. One tap. One year. Every choice matters.

---

## Setup

### 1. Install Node.js
Download from https://nodejs.org — choose the LTS version. Run the installer.

### 2. Install dependencies
Open Terminal (Mac) or Command Prompt (Windows) and run:

```bash
cd path/to/lifespan
npm install
```

### 3. Run locally
```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

---

## Deploy to Vercel

### 1. Push to GitHub
- Create a new repo at github.com
- Push this folder to it

### 2. Connect to Vercel
- Go to vercel.com
- Click "Add New Project"
- Import your GitHub repo
- Click Deploy — it handles everything automatically

Every time you push to GitHub, Vercel redeploys automatically.

---

## Project Structure

```
lifespan/
├── app/                    Next.js app shell
│   ├── page.tsx            Entry point — routes between screens
│   ├── layout.tsx          HTML wrapper
│   └── globals.css         Global dark styles
│
├── components/             UI screens
│   ├── TitleScreen.tsx     Main menu
│   ├── NewGameScreen.tsx   Character creation
│   ├── GameScreen.tsx      Core game loop
│   └── DeathScreen.tsx     End of life
│
├── engine/                 Game logic (no UI)
│   ├── types.ts            All TypeScript types
│   ├── character.ts        Character creation
│   ├── consequences.ts     Applies event outcomes to character
│   └── eventSelector.ts    70/30 event selection engine
│
├── content/                The soul of the game
│   └── events/
│       ├── childhood.ts    Ages 0–12 (20 events)
│       └── adolescence.ts  Ages 13–18 (20 events)
│
└── store/
    └── gameStore.ts        Game state + localStorage saves
```

---

## Adding New Events

Open any file in `content/events/` and add a new event object:

```typescript
{
  id: 'unique_id',                    // must be unique
  ageRange: [20, 30],                 // fires between these ages
  weight: 'consequence',              // 'consequence' (70%) or 'chaos' (30%)
  requires: {
    flags: ['went_to_college'],       // optional: required flags
    notFlags: ['dropped_out'],        // optional: flags that block this event
  },
  narrative: 'Something happened.',  // what the player reads
  choices: [                          // optional: leave out for auto-events
    {
      text: 'The choice text',
      outcome: {
        narrative: 'What happened after.',
        consequences: [
          { type: 'value', key: 'ambition', delta: 1 },
          { type: 'flag', key: 'made_choice', value: true },
        ],
      },
    },
  ],
}
```

Then add it to `content/index.ts` if you create a new file.

---

## Current State

- Ages 0–18 fully playable (~40 events)
- 70/30 consequence/chaos engine running
- All choices affect invisible character state
- Saves to localStorage automatically
- Mobile-responsive (works on phone browser)

Next: events for ages 18–90, relationship system, career system, generational play.
