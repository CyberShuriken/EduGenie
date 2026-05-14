import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { generateQuiz } from "@/lib/openrouter";

const schema = z.object({
  noteId: z.string().uuid(),
  questionCount: z.number().int().min(3).max(6).optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Choose a note before generating a quiz." }, { status: 400 });
  }

  const { noteId, questionCount = 5 } = parsed.data;
  const { data: cached } = await supabase
    .from("quizzes")
    .select("quiz_data")
    .eq("note_id", noteId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (cached?.quiz_data) return NextResponse.json({ quiz: cached.quiz_data, cached: true });

  const { data: noteData, error } = await supabase
    .from("notes")
    .select("id, content")
    .eq("id", noteId)
    .eq("user_id", user.id)
    .single();
  const note = noteData as unknown as { id: string; content: string } | null;

  if (error || !note) return NextResponse.json({ error: "Note not found." }, { status: 404 });

  try {
    const quiz = await generateQuiz(note.content, questionCount);
    await supabase.from("quizzes").insert({
      user_id: user.id,
      note_id: noteId,
      quiz_data: quiz,
    });
    return NextResponse.json({ quiz, cached: false });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Quiz generation failed." },
      { status: 503 },
    );
  }
}
