create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  summary text,
  file_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  note_id uuid not null references public.notes(id) on delete cascade,
  quiz_data jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  note_id uuid not null references public.notes(id) on delete cascade,
  flashcard_data jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists notes_user_created_idx on public.notes(user_id, created_at desc);
create index if not exists quizzes_user_note_idx on public.quizzes(user_id, note_id, created_at desc);
create index if not exists quizzes_note_id_idx on public.quizzes(note_id);
create index if not exists flashcards_user_note_idx on public.flashcards(user_id, note_id, created_at desc);
create index if not exists flashcards_note_id_idx on public.flashcards(note_id);

alter table public.profiles enable row level security;
alter table public.notes enable row level security;
alter table public.quizzes enable row level security;
alter table public.flashcards enable row level security;

drop policy if exists "profiles are owner readable" on public.profiles;
create policy "profiles are owner readable"
  on public.profiles for select
  using ((select auth.uid()) = id);

drop policy if exists "profiles are owner writable" on public.profiles;
create policy "profiles are owner writable"
  on public.profiles for insert
  with check ((select auth.uid()) = id);

drop policy if exists "profiles are owner updateable" on public.profiles;
create policy "profiles are owner updateable"
  on public.profiles for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "notes are owner readable" on public.notes;
create policy "notes are owner readable"
  on public.notes for select
  using ((select auth.uid()) = user_id);

drop policy if exists "notes are owner writable" on public.notes;
create policy "notes are owner writable"
  on public.notes for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists "notes are owner updateable" on public.notes;
create policy "notes are owner updateable"
  on public.notes for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "notes are owner deleteable" on public.notes;
create policy "notes are owner deleteable"
  on public.notes for delete
  using ((select auth.uid()) = user_id);

drop policy if exists "quizzes are owner readable" on public.quizzes;
create policy "quizzes are owner readable"
  on public.quizzes for select
  using ((select auth.uid()) = user_id);

drop policy if exists "quizzes are owner writable" on public.quizzes;
create policy "quizzes are owner writable"
  on public.quizzes for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists "flashcards are owner readable" on public.flashcards;
create policy "flashcards are owner readable"
  on public.flashcards for select
  using ((select auth.uid()) = user_id);

drop policy if exists "flashcards are owner writable" on public.flashcards;
create policy "flashcards are owner writable"
  on public.flashcards for insert
  with check ((select auth.uid()) = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'note-files',
  'note-files',
  false,
  10485760,
  array['application/pdf', 'text/plain']
)
on conflict (id) do nothing;

drop policy if exists "users can read own note files" on storage.objects;
create policy "users can read own note files"
  on storage.objects for select
  using (bucket_id = 'note-files' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "users can upload own note files" on storage.objects;
create policy "users can upload own note files"
  on storage.objects for insert
  with check (bucket_id = 'note-files' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "users can update own note files" on storage.objects;
create policy "users can update own note files"
  on storage.objects for update
  using (bucket_id = 'note-files' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'note-files' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "users can delete own note files" on storage.objects;
create policy "users can delete own note files"
  on storage.objects for delete
  using (bucket_id = 'note-files' and auth.uid()::text = (storage.foldername(name))[1]);
