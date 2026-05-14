"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FlashcardData, Note, QuizData } from "@/types/study";

type Mode = "summary" | "quiz" | "flashcards";

export function AiGeneratePanel({
  notes,
  mode,
}: {
  notes: Note[];
  mode: Mode;
}) {
  const [noteId, setNoteId] = useState(notes[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | QuizData | FlashcardData | null>(null);
  const endpoint = mode === "summary" ? "/api/summarize" : mode === "quiz" ? "/api/quiz" : "/api/flashcards";

  const title = useMemo(
    () =>
      ({
        summary: "AI Summaries",
        quiz: "Quiz Generator",
        flashcards: "Flashcard Generator",
      })[mode],
    [mode],
  );

  async function generate() {
    if (!noteId) {
      toast.error("Upload a note first.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Generation failed.");
      setResult(data.summary ?? data.quiz ?? data.flashcards);
      toast.success(data.cached ? "Loaded from cache. No tokens spent." : "Generated with a free model.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Generation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <Card className="border-white/10 bg-card/80">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            Uses OpenRouter free models with cached results to protect your quota.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={noteId} onValueChange={setNoteId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a note" />
            </SelectTrigger>
            <SelectContent>
              {notes.map((note) => (
                <SelectItem key={note.id} value={note.id}>
                  {note.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={generate} disabled={loading || !noteId} className="w-full gap-2">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            Generate
          </Button>
        </CardContent>
      </Card>
      <Card className="min-h-[420px] border-white/10 bg-card/70">
        <CardHeader>
          <CardTitle>Result</CardTitle>
          <CardDescription>Cached generations appear instantly on repeat requests.</CardDescription>
        </CardHeader>
        <CardContent>
          {!result ? (
            <div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed border-white/10 text-center text-sm text-muted-foreground">
              Choose a note and generate a study artifact.
            </div>
          ) : typeof result === "string" ? (
            <div className="whitespace-pre-wrap rounded-lg bg-muted/40 p-5 leading-7">{result}</div>
          ) : "questions" in result ? (
            <div className="space-y-4">
              {result.questions.map((question, index) => (
                <div key={question.question} className="rounded-lg border border-white/10 bg-muted/30 p-4">
                  <p className="font-medium">
                    {index + 1}. {question.question}
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {question.options.map((option) => (
                      <div key={option} className="rounded-md bg-background/60 px-3 py-2 text-sm">
                        {option}
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-primary">Answer: {question.answer}</p>
                  <p className="text-sm text-muted-foreground">{question.explanation}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {result.cards.map((card) => (
                <div key={card.front} className="rounded-lg border border-white/10 bg-muted/30 p-4">
                  <p className="text-sm font-semibold text-primary">{card.front}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{card.back}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
