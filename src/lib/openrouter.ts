import { z } from "zod";
import type { ChatMessage, FlashcardData, QuizData } from "@/types/study";
import { appUrl } from "@/lib/env";
import { requireOpenRouterKey } from "@/lib/server-env";

export const FREE_MODELS = [
  "deepseek/deepseek-chat:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemma-2-9b-it:free",
  "mistralai/mistral-7b-instruct:free",
] as const;

const quizSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).min(2).max(4),
      answer: z.string(),
      explanation: z.string(),
    }),
  ),
});

const flashcardSchema = z.object({
  cards: z.array(z.object({ front: z.string(), back: z.string() })),
});

type AiResult = {
  content: string;
  model: string;
};

function trimForAi(input: string, maxChars = 9000) {
  return input.replace(/\s+/g, " ").trim().slice(0, maxChars);
}

function openRouterErrorMessage(status: number) {
  if (status === 401) return "OpenRouter key is missing or invalid.";
  if (status === 402 || status === 429) return "Free model quota or rate limit reached.";
  if (status >= 500) return "OpenRouter is temporarily unavailable.";
  return "AI request failed.";
}

export async function callFreeModel(messages: ChatMessage[], maxTokens = 700): Promise<AiResult> {
  const key = requireOpenRouterKey();
  let lastError = "All free models failed.";

  for (const model of FREE_MODELS) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": appUrl,
        "X-Title": "EduGenie AI",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.35,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter error (${model}): ${response.status} - ${errorText}`);
      lastError = openRouterErrorMessage(response.status);
      if ([401, 403].includes(response.status)) break;
      continue;
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content?.trim();
    if (content) return { content, model };
    lastError = "The free model returned an empty response.";
  }

  throw new Error(lastError);
}

export async function summarizeNote(content: string) {
  const result = await callFreeModel(
    [
      {
        role: "user",
        content: `Summarize for study in <=160 words. Use bullets, key terms, and exam hints. Notes: ${trimForAi(content)}`,
      },
    ],
    360,
  );
  return result.content;
}

function parseJsonObject(raw: string) {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  const json = start >= 0 && end >= 0 ? cleaned.slice(start, end + 1) : cleaned;
  return JSON.parse(json);
}

export async function generateQuiz(content: string, count = 5): Promise<QuizData> {
  const safeCount = Math.min(Math.max(count, 3), 6);
  const result = await callFreeModel(
    [
      {
        role: "user",
        content: `Return JSON only: {"questions":[{"question":"","options":["","","",""],"answer":"","explanation":""}]}. Make ${safeCount} concise quiz questions from: ${trimForAi(content, 7000)}`,
      },
    ],
    900,
  );
  return quizSchema.parse(parseJsonObject(result.content));
}

export async function generateFlashcards(content: string, count = 8): Promise<FlashcardData> {
  const safeCount = Math.min(Math.max(count, 4), 10);
  const result = await callFreeModel(
    [
      {
        role: "user",
        content: `Return JSON only: {"cards":[{"front":"","back":""}]}. Make ${safeCount} short study flashcards from: ${trimForAi(content, 7000)}`,
      },
    ],
    760,
  );
  return flashcardSchema.parse(parseJsonObject(result.content));
}

export async function chatWithNote(note: string, messages: ChatMessage[]) {
  const recent = messages.slice(-6);
  const compactMessages = recent.map((message) => ({
    role: message.role,
    content: message.content.slice(0, 900),
  }));

  const result = await callFreeModel(
    [
      {
        role: "user",
        content: `You are EduGenie. Answer only from these notes. Be concise. Notes: ${trimForAi(note, 6500)}`,
      },
      ...compactMessages,
    ],
    500,
  );

  return result.content;
}
