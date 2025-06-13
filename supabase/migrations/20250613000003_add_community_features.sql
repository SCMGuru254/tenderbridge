-- Create communities table
create table if not exists communities (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    category text not null,
    rules text[],
    avatar_url text,
    banner_url text,
    is_private boolean default false,
    member_count integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create community_members table
create table if not exists community_members (
    id uuid default uuid_generate_v4() primary key,
    community_id uuid references communities(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    role text not null check (role in ('admin', 'moderator', 'member')),
    joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(community_id, user_id)
);

-- Create community_posts table
create table if not exists community_posts (
    id uuid default uuid_generate_v4() primary key,
    community_id uuid references communities(id) on delete cascade,
    author_id uuid references auth.users(id) on delete cascade,
    title text not null,
    content text not null,
    media_urls text[],
    post_type text not null check (post_type in ('discussion', 'question', 'resource', 'event', 'job')),
    likes_count integer default 0,
    comments_count integer default 0,
    is_pinned boolean default false,
    is_locked boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create community_post_comments table
create table if not exists community_post_comments (
    id uuid default uuid_generate_v4() primary key,
    post_id uuid references community_posts(id) on delete cascade,
    author_id uuid references auth.users(id) on delete cascade,
    content text not null,
    likes_count integer default 0,
    parent_comment_id uuid references community_post_comments(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create community_post_reactions table
create table if not exists community_post_reactions (
    id uuid default uuid_generate_v4() primary key,
    post_id uuid references community_posts(id) on delete cascade,
    comment_id uuid references community_post_comments(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    reaction_type text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    check (
        (post_id is not null and comment_id is null) or
        (post_id is null and comment_id is not null)
    ),
    unique(post_id, user_id) where comment_id is null,
    unique(comment_id, user_id) where post_id is null
);

-- Create community_tags table
create table if not exists community_tags (
    id uuid default uuid_generate_v4() primary key,
    community_id uuid references communities(id) on delete cascade,
    name text not null,
    color text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(community_id, name)
);

-- Create community_post_tags table
create table if not exists community_post_tags (
    post_id uuid references community_posts(id) on delete cascade,
    tag_id uuid references community_tags(id) on delete cascade,
    primary key (post_id, tag_id)
);

-- Create triggers for updating timestamps
create trigger update_communities_updated_at
    before update on communities
    for each row
    execute procedure update_updated_at_column();

create trigger update_community_posts_updated_at
    before update on community_posts
    for each row
    execute procedure update_updated_at_column();

create trigger update_community_post_comments_updated_at
    before update on community_post_comments
    for each row
    execute procedure update_updated_at_column();

-- Create function to update member count
create or replace function update_community_member_count()
returns trigger as $$
begin
    if (TG_OP = 'INSERT') then
        update communities
        set member_count = member_count + 1
        where id = new.community_id;
    elsif (TG_OP = 'DELETE') then
        update communities
        set member_count = member_count - 1
        where id = old.community_id;
    end if;
    return null;
end;
$$ language plpgsql;

create trigger update_member_count
    after insert or delete on community_members
    for each row
    execute procedure update_community_member_count();

-- Create function to update comment count
create or replace function update_post_comment_count()
returns trigger as $$
begin
    if (TG_OP = 'INSERT') then
        update community_posts
        set comments_count = comments_count + 1
        where id = new.post_id;
    elsif (TG_OP = 'DELETE') then
        update community_posts
        set comments_count = comments_count - 1
        where id = old.post_id;
    end if;
    return null;
end;
$$ language plpgsql;

create trigger update_comment_count
    after insert or delete on community_post_comments
    for each row
    execute procedure update_post_comment_count();

-- Create function to update like counts
create or replace function update_reaction_counts()
returns trigger as $$
begin
    if (TG_OP = 'INSERT') then
        if new.post_id is not null then
            update community_posts
            set likes_count = likes_count + 1
            where id = new.post_id;
        else
            update community_post_comments
            set likes_count = likes_count + 1
            where id = new.comment_id;
        end if;
    elsif (TG_OP = 'DELETE') then
        if old.post_id is not null then
            update community_posts
            set likes_count = likes_count - 1
            where id = old.post_id;
        else
            update community_post_comments
            set likes_count = likes_count - 1
            where id = old.comment_id;
        end if;
    end if;
    return null;
end;
$$ language plpgsql;

create trigger update_reaction_counts
    after insert or delete on community_post_reactions
    for each row
    execute procedure update_reaction_counts();
