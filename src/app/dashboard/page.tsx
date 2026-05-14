import Link from "next/link";
import { BookOpen, FileText, Layers, Sparkles, UploadCloud } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/study-data";

export default async function DashboardPage() {
  const { notes, quizzes, flashcards } = await getDashboardData();
  const summarized = notes.filter((note) => note.summary).length;
  const stats = [
    { label: "Notes", value: notes.length, icon: BookOpen },
    { label: "Summaries", value: summarized, icon: FileText },
    { label: "Quizzes", value: quizzes.length, icon: Sparkles },
    { label: "Flashcard sets", value: flashcards.length, icon: Layers },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-card/70 p-6 shadow-xl shadow-cyan-950/20 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <Badge className="mb-4 bg-primary/15 text-primary hover:bg-primary/15">Free-tier optimized</Badge>
            <h2 className="text-3xl font-semibold tracking-tight">Your academic command center</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Upload notes once, generate compact study assets, and reuse cached outputs without spending extra OpenRouter quota.
            </p>
          </div>
          <Button asChild size="lg" className="gap-2">
            <Link href="/upload">
              <UploadCloud className="size-4" />
              Upload new note
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="border-white/10 bg-card/80">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-2 text-3xl font-semibold">{value}</p>
              </div>
              <div className="rounded-xl bg-primary/15 p-3 text-primary">
                <Icon className="size-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/10 bg-card/80">
          <CardHeader>
            <CardTitle>Recent notes</CardTitle>
            <CardDescription>Your latest uploaded learning materials.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {notes.length === 0 ? (
              <EmptyState href="/upload" label="Upload your first note" />
            ) : (
              notes.map((note) => (
                <div key={note.id} className="rounded-lg border border-white/10 bg-background/50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium">{note.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{note.content}</p>
                    </div>
                    {note.summary ? <Badge variant="secondary">summarized</Badge> : <Badge variant="outline">new</Badge>}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/80">
          <CardHeader>
            <CardTitle>AI activity</CardTitle>
            <CardDescription>Cached generations reduce repeated token usage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ActivityRow label="Generated quizzes" value={quizzes.length} />
            <ActivityRow label="Flashcard sets" value={flashcards.length} />
            <ActivityRow label="Cached summaries" value={summarized} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function ActivityRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-background/50 p-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold text-primary">{value}</span>
    </div>
  );
}

function EmptyState({ href, label }: { href: string; label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-white/10 p-8 text-center">
      <p className="text-sm text-muted-foreground">Nothing here yet.</p>
      <Button asChild className="mt-4">
        <Link href={href}>{label}</Link>
      </Button>
    </div>
  );
}
