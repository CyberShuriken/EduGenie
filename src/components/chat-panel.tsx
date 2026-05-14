"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ChatMessage, Note } from "@/types/study";

export function ChatPanel({ notes }: { notes: Note[] }) {
  const [noteId, setNoteId] = useState(notes[0]?.id ?? "");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Choose a note and ask a focused study question." },
  ]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!noteId || !input.trim()) return;
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: input.trim() }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId, messages: nextMessages.filter((m) => m.role !== "assistant" || m.content) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Chat failed.");
      setMessages([...nextMessages, { role: "assistant", content: data.message }]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Chat failed.");
      setMessages(nextMessages);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-white/10 bg-card/80">
      <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Chat with notes</CardTitle>
          <p className="text-sm text-muted-foreground">No embeddings. EduGenie reads a compact note excerpt.</p>
        </div>
        <Select value={noteId} onValueChange={setNoteId}>
          <SelectTrigger className="w-full md:w-80">
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
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="min-h-[420px] space-y-3 rounded-lg border border-white/10 bg-background/50 p-4">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={
                message.role === "user"
                  ? "ml-auto max-w-[82%] rounded-lg bg-primary px-4 py-3 text-sm text-primary-foreground"
                  : "max-w-[82%] rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground"
              }
            >
              {message.content}
            </div>
          ))}
        </div>
        <form onSubmit={send} className="flex flex-col gap-3 md:flex-row">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask: What should I memorize for the exam?"
            rows={2}
          />
          <Button disabled={loading || !noteId || !input.trim()} className="gap-2 md:w-36">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
