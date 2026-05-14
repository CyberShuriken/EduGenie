import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { generateFlashcards } from "@/lib/openrouter";

const schema = z.object({
  noteId: z.string().uuid(),
  count: z.number().int().min(4).max(10).optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Choose a note before generating flashcards." }, { status: 400 });
  }

  const { noteId, count = 8 } = parsed.data;
  const { data: cached } = await supabase
    .from("flashcards")
    .select("flashcard_data")
    .eq("note_id", noteId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (cached?.flashcard_data) {
    return NextResponse.json({ flashcards: cached.flashcard_data, cached: true });
  }

  const { data: noteData, error } = await supabase
    .from("notes")
    .select("id, content")
    .eq("id", noteId)
    .eq("user_id", user.id)
    .single();
  const note = noteData as unknown as { id: string; content: string } | null;

  if (error || !note) return NextResponse.json({ error: "Note not found." }, { status: 404 });

  try {
    const flashcards = await generateFlashcards(note.content, count);
    await supabase.from("flashcards").insert({
      user_id: user.id,
      note_id: noteId,
      flashcard_data: flashcards,
    });
    return NextResponse.json({ flashcards, cached: false });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Flashcard generation failed." },
      { status: 503 },
    );
  }
}
