-- Rewards System Backend Setup
-- Ensure required extension for UUID generation
create extension if not exists pgcrypto;

-- 1) Core Tables
create table if not exists public.rewards_points (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_balance integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.rewards_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  points integer not null,
  description text,
  source text not null,
  reference_id text,
  created_at timestamptz not null default now()
);

-- 2) Indexes for performance and idempotency
create index if not exists idx_rewards_transactions_user_time
  on public.rewards_transactions(user_id, created_at desc);
create index if not exists idx_rewards_transactions_source
  on public.rewards_transactions(source);
create index if not exists idx_rewards_transactions_reference
  on public.rewards_transactions(reference_id);

-- Prevent duplicate awards for the same event when reference_id is provided
create unique index if not exists ux_rewards_unique_event
  on public.rewards_transactions(user_id, source, reference_id)
  where reference_id is not null;

-- 3) Enable Row Level Security
alter table public.rewards_points enable row level security;
alter table public.rewards_transactions enable row level security;

-- Policies: users can only read their own data. Writes are only via RPC.
create policy if not exists "Users can view their own rewards balance"
  on public.rewards_points
  for select
  using (auth.uid() = user_id);

create policy if not exists "Users can view their own reward transactions"
  on public.rewards_transactions
  for select
  using (auth.uid() = user_id);

-- 4) RPCs
-- Award points to the authenticated user. Idempotent when reference_id is provided.
create or replace function public.award_points(
  p_user_id uuid,
  p_points integer,
  p_description text,
  p_source text,
  p_reference_id text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_new_balance integer;
begin
  -- Enforce caller can only award points to themselves
  if p_user_id is distinct from auth.uid() then
    raise exception 'Not authorized to award points for this user.' using errcode = '28000';
  end if;

  -- Idempotency: if reference provided and already processed, do nothing
  if p_reference_id is not null then
    if exists (
      select 1 from public.rewards_transactions rt
      where rt.user_id = p_user_id
        and rt.source = p_source
        and rt.reference_id = p_reference_id
    ) then
      return; -- already awarded for this event
    end if;
  end if;

  -- Ensure points record exists
  insert into public.rewards_points (user_id, current_balance)
  values (p_user_id, 0)
  on conflict (user_id) do nothing;

  -- Update balance (no negative balances)
  update public.rewards_points
  set current_balance = greatest(0, current_balance + p_points),
      updated_at = now()
  where user_id = p_user_id
  returning current_balance into v_new_balance;

  -- Record transaction
  insert into public.rewards_transactions (user_id, points, description, source, reference_id)
  values (p_user_id, p_points, p_description, p_source, p_reference_id);
end;
$$;

-- Convenience function to get current user's points
create or replace function public.get_user_points()
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(rp.current_balance, 0)
  from public.rewards_points rp
  where rp.user_id = auth.uid();
$$;

-- 5) Grants: allow authenticated users to call RPCs
revoke all on function public.award_points(uuid, integer, text, text, text) from public;
revoke all on function public.get_user_points() from public;
grant execute on function public.award_points(uuid, integer, text, text, text) to authenticated;
grant execute on function public.get_user_points() to authenticated;