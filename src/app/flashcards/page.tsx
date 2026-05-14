import { AiGeneratePanel } from "@/components/ai-generate-panel";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/study-data";
import type { Note } from "@/types/study";

export default async function FlashcardsPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold">Flashcards</h2>
        <p className="mt-2 text-muted-foreground">Turn lecture material into memorization cards.</p>
      </div>
      <AiGeneratePanel notes={(data ?? []) as Note[]} mode="flashcards" />
    </div>
  );
}
