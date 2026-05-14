import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function getDashboardData() {
  const user = await requireUser();
  const supabase = await createClient();

  const [notesResult, quizzesResult, flashcardsResult] = await Promise.all([
    supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("quizzes")
      .select("*, notes(title)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("flashcards")
      .select("*, notes(title)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return {
    user,
    notes: notesResult.data ?? [],
    quizzes: quizzesResult.data ?? [],
    flashcards: flashcardsResult.data ?? [],
  };
}
