# EduGenie AI

EduGenie is an AI-powered academic assistant designed to help students study smarter using artificial intelligence.

Built with Next.js, Supabase, OpenRouter, Tailwind CSS, and Vercel.

---

## Features

- AI-powered note summarization
- Quiz generation from study materials
- Flashcard generation
- Student dashboard
- PDF upload support
- Authentication with Supabase
- Modern responsive UI
- Secure API integration

---

## Tech Stack

### Frontend
- Next.js 15
- React
- Tailwind CSS
- shadcn/ui

### Backend
- Next.js API Routes

### Database & Authentication
- Supabase

### AI Integration
- OpenRouter API

### Deployment
- Vercel

---

## Project Structure

```bash
EduGenie/
├── app/
├── components/
├── lib/
├── public/
├── styles/
├── app/api/
├── .env.local
├── .gitignore
└── README.md
```

---

## Environment Variables

Create a `.env.local` file:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Security

Never expose your API keys publicly.

Make sure the following files are included in `.gitignore`:

```gitignore
.env
.env.local
.env.production
```

---

## Installation

```bash
git clone https://github.com/CyberShuriken/EduGenie.git
cd EduGenie
npm install
npm run dev
```

---

## Deployment

### Frontend Hosting
- Vercel

### Database & Auth
- Supabase

### AI Models
- OpenRouter

---

## Planned Features

- AI study planner
- Chat with notes
- Smart revision system
- AI learning analytics
- Multi-language support
- Voice assistant

---

## Author

Developed by CyberShuriken.

---

## License

MIT License
