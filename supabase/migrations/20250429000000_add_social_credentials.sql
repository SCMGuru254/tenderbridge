-- Create social_credentials table
create table "public"."social_credentials" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
    "updated_at" timestamp with time zone default timezone('utc'::text, now()) not null,
    "user_id" uuid references auth.users not null,
    "platform" text not null,
    "credentials" jsonb not null,
    primary key ("id")
);

-- Set up Row Level Security (RLS)
alter table "public"."social_credentials" enable row level security;

-- Create policy to allow users to manage their own credentials
create policy "Users can manage their own social credentials"
    on "public"."social_credentials"
    for all
    using (auth.uid() = user_id);