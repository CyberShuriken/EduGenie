import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { summarizeNote } from "@/lib/openrouter";

const schema = z.object({
  noteId: z.string().uuid().optional(),
  content: z.string().min(80).optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Provide a noteId or note content." }, { status: 400 });
  }

  let content = parsed.data.content;
  const noteId = parsed.data.noteId;

  if (noteId) {
    const { data: noteData, error } = await supabase
      .from("notes")
      .select("id, content, summary")
      .eq("id", noteId)
      .eq("user_id", user.id)
      .single();
    const note = noteData as unknown as { id: string; content: string; summary: string | null } | null;
    if (error || !note) return NextResponse.json({ error: "Note not found." }, { status: 404 });
    if (note.summary) return NextResponse.json({ summary: note.summary, cached: true });
    content = note.content;
  }

  if (!content) return NextResponse.json({ error: "No note content found." }, { status: 400 });

  try {
    const summary = await summarizeNote(content);
    if (noteId) {
      await supabase.from("notes").update({ summary }).eq("id", noteId).eq("user_id", user.id);
    }
    return NextResponse.json({ summary, cached: false });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Summary generation failed." },
      { status: 503 },
    );
  }
}
