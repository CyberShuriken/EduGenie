import { ChatPanel } from "@/components/chat-panel";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/study-data";
import type { Note } from "@/types/study";

export default async function ChatPage() {
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
        <h2 className="text-3xl font-semibold">Chat with notes</h2>
        <p className="mt-2 text-muted-foreground">Grounded answers using compact note context, not paid embeddings.</p>
      </div>
      <ChatPanel notes={(data ?? []) as Note[]} />
    </div>
  );
}
