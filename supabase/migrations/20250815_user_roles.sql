create table if not exists user_roles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, role)
);

-- Add RLS policies
alter table user_roles enable row level security;

-- Allow admins to manage all roles
create policy "Admins can manage all roles"
  on user_roles
  for all
  to authenticated
  using (
    exists (
      select 1 from user_roles ur
      where ur.user_id = auth.uid()
      and ur.role = 'admin'
    )
  );

-- Allow users to view their own roles
create policy "Users can view their own roles"
  on user_roles
  for select
  to authenticated
  using (user_id = auth.uid());

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Trigger to update updated_at timestamp
create trigger update_user_roles_updated_at
  before update on user_roles
  for each row
  execute function update_updated_at_column();

-- Create initial admin user (replace with your admin user's ID)
-- insert into user_roles (user_id, role) values ('your-admin-user-id', 'admin');
