-- Schema for HireMySkill feature

-- Skills table
create table public.skills (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(name, category)
);

-- Professional profiles table
create table public.professional_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  summary text,
  hourly_rate numeric(10,2),
  availability text,
  experience_years integer,
  education text,
  certifications text[],
  portfolio_url text,
  linkedin_url text,
  github_url text,
  website_url text,
  is_available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Professional skills table (junction table)
create table public.professional_skills (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.professional_profiles not null,
  skill_id uuid references public.skills not null,
  proficiency_level text not null check (proficiency_level in ('beginner', 'intermediate', 'advanced', 'expert')),
  years_experience numeric(4,1),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(profile_id, skill_id)
);

-- Projects/Jobs table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references auth.users not null,
  title text not null,
  description text not null,
  budget_min numeric(10,2),
  budget_max numeric(10,2),
  duration_estimate text,
  requirements text[],
  status text default 'open' check (status in ('open', 'in_progress', 'completed', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Project skills required (junction table)
create table public.project_skills (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects not null,
  skill_id uuid references public.skills not null,
  minimum_proficiency text check (minimum_proficiency in ('beginner', 'intermediate', 'advanced', 'expert')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(project_id, skill_id)
);

-- Project proposals
create table public.project_proposals (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects not null,
  professional_id uuid references public.professional_profiles not null,
  cover_letter text not null,
  proposed_rate numeric(10,2) not null,
  estimated_hours integer,
  availability_start date,
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(project_id, professional_id)
);

-- Project contracts
create table public.project_contracts (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects not null,
  proposal_id uuid references public.project_proposals not null,
  professional_id uuid references public.professional_profiles not null,
  client_id uuid references auth.users not null,
  start_date date not null,
  end_date date,
  agreed_rate numeric(10,2) not null,
  payment_terms text,
  status text default 'draft' check (status in ('draft', 'signed', 'active', 'completed', 'terminated')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Project reviews
create table public.project_reviews (
  id uuid default gen_random_uuid() primary key,
  contract_id uuid references public.project_contracts not null,
  reviewer_id uuid references auth.users not null,
  reviewee_id uuid references auth.users not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  review_text text,
  communication_rating integer check (communication_rating >= 1 and communication_rating <= 5),
  quality_rating integer check (quality_rating >= 1 and quality_rating <= 5),
  timeliness_rating integer check (timeliness_rating >= 1 and timeliness_rating <= 5),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(contract_id, reviewer_id, reviewee_id)
);

-- RLS Policies
alter table public.skills enable row level security;
alter table public.professional_profiles enable row level security;
alter table public.professional_skills enable row level security;
alter table public.projects enable row level security;
alter table public.project_skills enable row level security;
alter table public.project_proposals enable row level security;
alter table public.project_contracts enable row level security;
alter table public.project_reviews enable row level security;

-- Skills policies
create policy "Skills are viewable by everyone"
  on public.skills for select
  using (true);

create policy "Skills can be created by authenticated users"
  on public.skills for insert
  with check (auth.role() = 'authenticated');

-- Professional profiles policies
create policy "Profiles are viewable by everyone"
  on public.professional_profiles for select
  using (true);

create policy "Users can create their own profile"
  on public.professional_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.professional_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Professional skills policies
create policy "Professional skills are viewable by everyone"
  on public.professional_skills for select
  using (true);

create policy "Users can manage their own professional skills"
  on public.professional_skills for all
  using (
    exists (
      select 1 from public.professional_profiles
      where id = professional_skills.profile_id
      and user_id = auth.uid()
    )
  );

-- Projects policies
create policy "Projects are viewable by everyone"
  on public.projects for select
  using (true);

create policy "Users can create projects"
  on public.projects for insert
  with check (auth.uid() = client_id);

create policy "Project owners can update their projects"
  on public.projects for update
  using (auth.uid() = client_id)
  with check (auth.uid() = client_id);

-- Project proposals policies
create policy "Proposals are viewable by involved parties"
  on public.project_proposals for select
  using (
    exists (
      select 1 from public.projects
      where id = project_proposals.project_id
      and client_id = auth.uid()
    )
    or
    exists (
      select 1 from public.professional_profiles
      where id = project_proposals.professional_id
      and user_id = auth.uid()
    )
  );

create policy "Professionals can create proposals"
  on public.project_proposals for insert
  with check (
    exists (
      select 1 from public.professional_profiles
      where id = professional_id
      and user_id = auth.uid()
    )
  );

-- Project contracts policies
create policy "Contracts are viewable by involved parties"
  on public.project_contracts for select
  using (
    auth.uid() = client_id
    or
    exists (
      select 1 from public.professional_profiles
      where id = project_contracts.professional_id
      and user_id = auth.uid()
    )
  );

create policy "Project owners can create contracts"
  on public.project_contracts for insert
  with check (
    exists (
      select 1 from public.projects
      where id = project_id
      and client_id = auth.uid()
    )
  );

-- Project reviews policies
create policy "Reviews are viewable by everyone"
  on public.project_reviews for select
  using (true);

create policy "Contract parties can create reviews"
  on public.project_reviews for insert
  with check (
    exists (
      select 1 from public.project_contracts
      where id = contract_id
      and (client_id = auth.uid() or professional_id in (
        select id from public.professional_profiles where user_id = auth.uid()
      ))
    )
  );
