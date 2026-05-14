import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileText,
  Layers,
  MessageSquareText,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: FileText, title: "Concise summaries", copy: "Convert dense notes into exam-ready bullets." },
  { icon: Sparkles, title: "Small quizzes", copy: "Generate focused practice sets without wasting tokens." },
  { icon: Layers, title: "Flashcards", copy: "Build memorization cards from lecture material." },
  { icon: MessageSquareText, title: "Chat with notes", copy: "Ask grounded questions from uploaded content." },
];

export function LandingPage() {
  return (
    <main className="overflow-hidden">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <BrainCircuit className="size-5" />
          </span>
          <span className="font-semibold">EduGenie AI</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#features">Features</a>
          <a href="#workflow">Workflow</a>
          <a href="#proof">Proof</a>
        </nav>
        <Button asChild>
          <Link href="/signup">Start free</Link>
        </Button>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-10 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
        <div>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            EduGenie AI
          </h1>
          <p className="mt-5 max-w-2xl text-xl text-muted-foreground">
            AI-powered academic assistant for smarter studying.
          </p>
          <p className="mt-6 max-w-2xl leading-8 text-muted-foreground">
            Upload notes, generate compact summaries, practice quizzes, flashcards, and ask questions from your own material using OpenRouter free-tier models.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <Link href="/signup">
                Build my study workspace <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Log in</Link>
            </Button>
          </div>
          <div className="mt-8 grid max-w-xl gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            {["Free-model fallback", "Cached AI outputs", "No vector DB cost"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-primary/10 blur-3xl" />
          <Card className="relative overflow-hidden border-white/10 bg-card/80 shadow-2xl shadow-cyan-950/40 backdrop-blur">
            <CardContent className="p-0">
              <div className="border-b border-white/10 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Today&apos;s study sprint</p>
                    <h2 className="text-2xl font-semibold">Cognitive Psychology</h2>
                  </div>
                  <span className="rounded-full bg-primary/15 px-3 py-1 text-xs text-primary">
                    cached
                  </span>
                </div>
              </div>
              <div className="grid gap-4 p-5">
                <div className="rounded-xl border border-white/10 bg-background/60 p-4">
                  <p className="text-sm font-medium">Summary</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Working memory is limited, temporary, and improved by chunking, rehearsal, and reducing cognitive load.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-background/60 p-4">
                    <p className="text-3xl font-semibold text-primary">5</p>
                    <p className="text-sm text-muted-foreground">Quiz questions</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-background/60 p-4">
                    <p className="text-3xl font-semibold text-primary">8</p>
                    <p className="text-sm text-muted-foreground">Flashcards</p>
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-background/60 p-4">
                  <p className="text-sm text-muted-foreground">Student question</p>
                  <p className="mt-2 text-sm">What should I review before the exam?</p>
                  <p className="mt-3 text-sm text-primary">
                    Focus on capacity limits, chunking examples, and interference effects.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="features" className="border-y border-white/10 bg-card/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold">A complete academic assistant, without expensive infrastructure.</h2>
            <p className="mt-4 text-muted-foreground">
              EduGenie is optimized around short prompts, cached generations, and practical study workflows.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-white/10 bg-background/60">
                  <CardContent className="p-5">
                    <Icon className="size-6 text-primary" />
                    <h3 className="mt-5 font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.copy}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="workflow" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            ["1", "Upload notes", "Store PDFs privately in Supabase Storage and extract readable text."],
            ["2", "Generate once", "Create summaries, quizzes, and flashcards through server API routes."],
            ["3", "Reuse forever", "Cached results keep free-tier OpenRouter usage low."],
          ].map(([step, title, copy]) => (
            <div key={step} className="rounded-2xl border border-white/10 bg-card/60 p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {step}
              </span>
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="proof" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-card/70 p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-center">
            <div>
              <h2 className="text-3xl font-semibold">Built for university demos and real study sessions.</h2>
              <p className="mt-4 text-muted-foreground">
                The product feels premium while staying honest about free-tier constraints.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-muted-foreground">
              {["Server-only API keys", "Supabase RLS", "Vercel-ready build", "Free OpenRouter model fallback"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-3 rounded-lg bg-background/60 p-3">
                    <UploadCloud className="size-4 text-primary" />
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
