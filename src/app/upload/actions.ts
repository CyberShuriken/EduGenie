"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { extractPdfText } from "@/lib/pdf";

export async function uploadNote(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const text = String(formData.get("content") ?? "").trim();
  const file = formData.get("file");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  let content = text;
  let filePath: string | null = null;

  if (file instanceof File && file.size > 0) {
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      content = await extractPdfText(file);
    } else if (file.type.startsWith("text/") || file.name.toLowerCase().endsWith(".txt")) {
      content = await file.text();
    }

    const extension = file.name.split(".").pop() || "pdf";
    filePath = `${user.id}/${crypto.randomUUID()}.${extension}`;
    await supabase.storage.from("note-files").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });
  }

  if (!title || content.trim().length < 40) {
    redirect("/upload?error=Add a title and at least 40 characters of note content.");
  }

  const { error } = await supabase.from("notes").insert({
    user_id: user.id,
    title,
    content: content.trim(),
    file_path: filePath,
  });

  if (error) redirect(`/upload?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/dashboard");
  revalidatePath("/upload");
  redirect("/dashboard");
}
