export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  summary: string | null;
  file_path: string | null;
  created_at: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type QuizData = {
  questions: QuizQuestion[];
};

export type Flashcard = {
  front: string;
  back: string;
};

export type FlashcardData = {
  cards: Flashcard[];
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};
