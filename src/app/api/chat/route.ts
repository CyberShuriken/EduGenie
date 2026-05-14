import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { chatWithNote } from "@/lib/openrouter";

const schema = z.object({
  noteId: z.string().uuid(),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(1200),
    }),
  ),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Choose a note and send a message." }, { status: 400 });
  }

  const { data: noteData, error } = await supabase
    .from("notes")
    .select("content")
    .eq("id", parsed.data.noteId)
    .eq("user_id", user.id)
    .single();
  const note = noteData as unknown as { content: string } | null;

  if (error || !note) return NextResponse.json({ error: "Note not found." }, { status: 404 });

  try {
    const message = await chatWithNote(note.content, parsed.data.messages);
    return NextResponse.json({ message });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Chat failed." },
      { status: 503 },
    );
  }
}
