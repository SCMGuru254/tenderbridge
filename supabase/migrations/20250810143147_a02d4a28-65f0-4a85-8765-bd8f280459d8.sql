-- Rewards System adjustments (non-destructive)
-- 1) Indexes for rewards_transactions
create index if not exists idx_rewards_transactions_user_time
  on public.rewards_transactions(user_id, created_at desc);
create index if not exists idx_rewards_transactions_source
  on public.rewards_transactions(source);
create index if not exists idx_rewards_transactions_reference
  on public.rewards_transactions(reference_id);

-- Idempotency guard: prevent duplicate events when reference_id provided
create unique index if not exists ux_rewards_unique_event
  on public.rewards_transactions(user_id, source, reference_id)
  where reference_id is not null;

-- 2) Enable RLS (no-op if already enabled)
alter table public.rewards_points enable row level security;
alter table public.rewards_transactions enable row level security;

-- 3) Read-only policies for users on their own data
-- Drop existing policies with same names to avoid duplicates
drop policy if exists "Users can view their own rewards balance" on public.rewards_points;
create policy "Users can view their own rewards balance"
  on public.rewards_points
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can view their own reward transactions" on public.rewards_transactions;
create policy "Users can view their own reward transactions"
  on public.rewards_transactions
  for select
  using (auth.uid() = user_id);

-- 4) Update existing RPC to be idempotent when reference_id is provided
create or replace function public.award_points(
  p_user_id uuid,
  p_points integer,
  p_description text,
  p_source text,
  p_reference_id uuid default null
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_points integer;
begin
  -- Only allow awarding points to self
  if p_user_id is distinct from auth.uid() then
    return false;
  end if;

  -- If reference_id provided and already processed, return true (idempotent)
  if p_reference_id is not null then
    if exists (
      select 1 from public.rewards_transactions rt
      where rt.user_id = p_user_id
        and rt.source = p_source
        and rt.reference_id = p_reference_id
    ) then
      return true;
    end if;
  end if;
  
  -- Insert transaction record
  insert into public.rewards_transactions (
    user_id, transaction_type, points, description, source, reference_id
  ) values (
    p_user_id, 'earn', p_points, p_description, p_source, p_reference_id
  );
  
  -- Update user balance & lifetime earned
  update public.rewards_points 
  set 
    current_balance = current_balance + p_points,
    lifetime_earned = lifetime_earned + p_points,
    updated_at = now()
  where user_id = p_user_id;
  
  -- Optional milestone achievement
  if p_points >= 500 then
    insert into public.user_achievements (
      user_id, achievement_type, achievement_data, points_awarded
    ) values (
      p_user_id, 'major_point_earn', 
      jsonb_build_object('points', p_points, 'source', p_source),
      p_points
    );
  end if;
  
  return true;
exception
  when others then
    return false;
end;
$$;

-- 5) Ensure RPC execute privileges for authenticated users
revoke all on function public.award_points(uuid, integer, text, text, uuid) from public;
grant execute on function public.award_points(uuid, integer, text, text, uuid) to authenticated;