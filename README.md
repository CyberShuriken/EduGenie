# EduGenie AI

EduGenie AI is a free-tier friendly academic assistant for students. It helps upload notes/PDFs, generate concise summaries, create small quizzes, build flashcards, and chat with note content through server-side OpenRouter API routes.

> Tagline: AI-powered academic assistant for smarter studying.  
> **Live Demo**: [https://edugenie-blush.vercel.app](https://edugenie-blush.vercel.app)


## Screenshots

Add screenshots after deployment:

- `public/screenshots/landing.png`
- `public/screenshots/dashboard.png`
- `public/screenshots/upload.png`

## Tech Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- Supabase Auth, Postgres, and private Storage
- OpenRouter free models
- Vercel free-tier deployment

## Free AI Model Strategy

EduGenie only uses OpenRouter free/free-tier models:

1. `deepseek/deepseek-chat-v3-0324:free`
2. `meta-llama/llama-3.3-70b-instruct:free`
3. `google/gemma-3-27b-it:free`
4. `mistralai/mistral-7b-instruct:free`

The backend keeps prompts compact, limits response size, retries free fallback models, and caches generated summaries, quizzes, and flashcards in Supabase.

## Features

- Supabase signup, login, logout
- Protected dashboard routes
- PDF/text note upload
- Private Supabase Storage bucket for source files
- AI summaries
- Quiz generation
- Flashcard generation
- Chat with notes without embeddings or vector databases
- Modern dark academic SaaS UI
- Mobile responsive dashboard
- Vercel-ready architecture

## Environment Setup

Create `.env.local`:

```bash
OPENROUTER_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

`OPENROUTER_API_KEY` is used only in server-side route handlers and must never be exposed as a `NEXT_PUBLIC_*` value.

## Supabase Setup

1. Create a free Supabase project.
2. Copy your project URL into `NEXT_PUBLIC_SUPABASE_URL`.
3. Copy your anon key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Run the SQL in `supabase/migrations/0001_initial_schema.sql` in the Supabase SQL editor.
5. Confirm the private Storage bucket `note-files` exists.

The schema creates:

- `profiles`
- `notes`
- `quizzes`
- `flashcards`
- private `note-files` bucket
- owner-only RLS policies

## OpenRouter Setup

1. Create an OpenRouter account.
2. Generate an API key.
3. Add it to `OPENROUTER_API_KEY`.
4. Enable free models in your OpenRouter account if required.

The app gracefully handles rate limits and tries the next configured free model when possible.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm run lint
npm run build
```

## Deployment

Deploy on Vercel free tier:

1. Import `https://github.com/CyberShuriken/EduGenie`.
2. Add the environment variables in Vercel Project Settings.
3. Deploy.

No Railway, Stripe, paid APIs, embeddings, or vector databases are required.

## Architecture

```text
src/
  app/
    api/                 server-only OpenRouter routes
    dashboard/           protected dashboard
    upload/              note upload workflow
    summaries/           cached summaries
    quizzes/             cached quizzes
    flashcards/          cached flashcards
    chat/                note-grounded chat
  components/            UI and feature components
  lib/
    openrouter.ts        free model fallback + compact prompts
    supabase/            browser/server/proxy clients
    study-data.ts        shared data helpers
  types/                 app and Supabase types
supabase/migrations/     database and storage schema
```

## Security Notes

- OpenRouter requests run only in Next.js route handlers.
- Supabase RLS restricts data to the owning user.
- PDF files are stored in a private bucket by user ID folder.
- `.env`, `.env.local`, and `.env.production` are ignored by Git.

## License

MIT License
