-- Create company_profiles table
create table if not exists company_profiles (
    id uuid default uuid_generate_v4() primary key,
    company_id uuid references companies(id) on delete cascade,
    description text,
    mission text,
    culture text,
    benefits text[],
    social_links jsonb,
    featured_images text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create company_updates table for company news/announcements
create table if not exists company_updates (
    id uuid default uuid_generate_v4() primary key,
    company_id uuid references companies(id) on delete cascade,
    title text not null,
    content text not null,
    update_type text not null check (update_type in ('news', 'announcement', 'milestone', 'hiring')),
    media_urls text[],
    likes_count integer default 0,
    comments_count integer default 0,
    is_featured boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create company_followers table
create table if not exists company_followers (
    id uuid default uuid_generate_v4() primary key,
    company_id uuid references companies(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(company_id, user_id)
);

-- Create company_team_members table
create table if not exists company_team_members (
    id uuid default uuid_generate_v4() primary key,
    company_id uuid references companies(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    role text not null,
    department text,
    is_featured boolean default false,
    testimonial text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(company_id, user_id)
);

-- Create company_events table
create table if not exists company_events (
    id uuid default uuid_generate_v4() primary key,
    company_id uuid references companies(id) on delete cascade,
    title text not null,
    description text not null,
    event_type text not null check (event_type in ('webinar', 'hiring_event', 'open_house', 'conference', 'other')),
    start_time timestamp with time zone not null,
    end_time timestamp with time zone not null,
    location jsonb,
    registration_url text,
    max_attendees integer,
    attendees_count integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create company_event_registrations table
create table if not exists company_event_registrations (
    id uuid default uuid_generate_v4() primary key,
    event_id uuid references company_events(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    status text not null check (status in ('registered', 'waitlisted', 'attended', 'cancelled')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(event_id, user_id)
);

-- Create triggers for updating timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger update_company_profiles_updated_at
    before update on company_profiles
    for each row
    execute procedure update_updated_at_column();

create trigger update_company_updates_updated_at
    before update on company_updates
    for each row
    execute procedure update_updated_at_column();

create trigger update_company_team_members_updated_at
    before update on company_team_members
    for each row
    execute procedure update_updated_at_column();

create trigger update_company_events_updated_at
    before update on company_events
    for each row
    execute procedure update_updated_at_column();

-- Create function to update counters
create or replace function update_company_event_attendees_count()
returns trigger as $$
begin
    if (TG_OP = 'INSERT') then
        update company_events
        set attendees_count = attendees_count + 1
        where id = new.event_id;
    elsif (TG_OP = 'DELETE') then
        update company_events
        set attendees_count = attendees_count - 1
        where id = old.event_id;
    end if;
    return null;
end;
$$ language plpgsql;

create trigger update_event_attendees_count
    after insert or delete on company_event_registrations
    for each row
    execute procedure update_company_event_attendees_count();
