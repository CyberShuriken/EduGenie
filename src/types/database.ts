import type { Json } from "@/types/study";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          email?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string | null;
          email?: string | null;
        };
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          summary: string | null;
          file_path: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          summary?: string | null;
          file_path?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          content?: string;
          summary?: string | null;
          file_path?: string | null;
        };
      };
      quizzes: {
        Row: {
          id: string;
          user_id: string;
          note_id: string;
          quiz_data: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          note_id: string;
          quiz_data: Json;
          created_at?: string;
        };
        Update: {
          quiz_data?: Json;
        };
      };
      flashcards: {
        Row: {
          id: string;
          user_id: string;
          note_id: string;
          flashcard_data: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          note_id: string;
          flashcard_data: Json;
          created_at?: string;
        };
        Update: {
          flashcard_data?: Json;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
