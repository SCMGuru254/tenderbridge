-- Create generated_documents table for the Document Generator AI feature
create table if not exists public.generated_documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  document_type text not null, -- 'cv', 'cover_letter', etc.
  language text not null default 'en',
  template_id text,
  content jsonb, -- Stores the generated JSON content
  status text default 'completed', -- 'processing', 'completed', 'failed'
  expiration_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.generated_documents enable row level security;

-- Policies
create policy "Users can view their own documents"
  on public.generated_documents for select
  using (auth.uid() = user_id);

create policy "Users can insert their own documents"
  on public.generated_documents for insert
  with check (auth.uid() = user_id);
