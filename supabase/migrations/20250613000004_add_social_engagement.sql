-- Create user_activity table to track all user actions
create table if not exists user_activity (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    activity_type text not null check (activity_type in (
        'job_view', 'job_apply', 'job_share',
        'community_join', 'community_post', 'community_comment',
        'profile_view', 'profile_update', 'connection_request',
        'endorsement_give', 'recommendation_write'
    )),
    target_id uuid,
    metadata jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_notifications table
create table if not exists user_notifications (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    notification_type text not null check (notification_type in (
        'job_match', 'application_update', 'connection_request',
        'endorsement', 'recommendation', 'community_mention',
        'post_reaction', 'comment_reply', 'event_reminder'
    )),
    title text not null,
    content text not null,
    link text,
    is_read boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_achievements table
create table if not exists user_achievements (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    achievement_type text not null,
    title text not null,
    description text not null,
    icon_url text,
    awarded_at timestamp with time zone default timezone('utc'::text, now()) not null,
    metadata jsonb
);

-- Create user_reputation table
create table if not exists user_reputation (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    category text not null,
    score integer not null default 0,
    level integer not null default 1,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_reputation_history table
create table if not exists user_reputation_history (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    category text not null,
    points integer not null,
    reason text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_engagement_metrics table
create table if not exists user_engagement_metrics (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    metric_type text not null,
    value integer not null default 0,
    last_updated timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create notification triggers
create or replace function create_notification()
returns trigger as $$
begin
    case
        when TG_TABLE_NAME = 'professional_connections' and TG_OP = 'INSERT' then
            insert into user_notifications (user_id, notification_type, title, content, link)
            values (
                new.target_user_id,
                'connection_request',
                'New Connection Request',
                'Someone wants to connect with you',
                '/networking/connections'
            );
        when TG_TABLE_NAME = 'skill_endorsements' and TG_OP = 'INSERT' then
            insert into user_notifications (user_id, notification_type, title, content, link)
            values (
                new.endorsed_user_id,
                'endorsement',
                'New Skill Endorsement',
                'Someone endorsed your skill',
                '/profile/skills'
            );
        when TG_TABLE_NAME = 'community_post_comments' and TG_OP = 'INSERT' and new.parent_comment_id is not null then
            insert into user_notifications (
                user_id,
                notification_type,
                title,
                content,
                link
            )
            select
                c.author_id,
                'comment_reply',
                'New Reply to Your Comment',
                'Someone replied to your comment',
                '/communities/posts/' || c.post_id
            from community_post_comments c
            where c.id = new.parent_comment_id;
    end case;
    return null;
end;
$$ language plpgsql;

create trigger connection_request_notification
    after insert on professional_connections
    for each row
    execute procedure create_notification();

create trigger endorsement_notification
    after insert on skill_endorsements
    for each row
    execute procedure create_notification();

create trigger comment_reply_notification
    after insert on community_post_comments
    for each row
    execute procedure create_notification();

-- Create activity tracking trigger
create or replace function track_user_activity()
returns trigger as $$
begin
    case
        when TG_TABLE_NAME = 'job_applications' and TG_OP = 'INSERT' then
            insert into user_activity (user_id, activity_type, target_id, metadata)
            values (
                new.user_id,
                'job_apply',
                new.job_id,
                jsonb_build_object('status', new.status)
            );
        when TG_TABLE_NAME = 'community_posts' and TG_OP = 'INSERT' then
            insert into user_activity (user_id, activity_type, target_id, metadata)
            values (
                new.author_id,
                'community_post',
                new.community_id,
                jsonb_build_object('post_type', new.post_type)
            );
        when TG_TABLE_NAME = 'professional_connections' and TG_OP = 'INSERT' then
            insert into user_activity (user_id, activity_type, target_id)
            values (
                new.user_id,
                'connection_request',
                new.target_user_id
            );
    end case;
    return null;
end;
$$ language plpgsql;

create trigger track_job_application
    after insert on job_applications
    for each row
    execute procedure track_user_activity();

create trigger track_community_post
    after insert on community_posts
    for each row
    execute procedure track_user_activity();

create trigger track_connection_request
    after insert on professional_connections
    for each row
    execute procedure track_user_activity();

-- Create reputation update trigger
create or replace function update_user_reputation()
returns trigger as $$
begin
    insert into user_reputation_history (user_id, category, points, reason)
    values (new.user_id, new.category, new.points, new.reason);

    update user_reputation
    set score = score + new.points,
        level = greatest(1, floor(ln(score + new.points)::integer)),
        updated_at = now()
    where user_id = new.user_id and category = new.category;

    if not found then
        insert into user_reputation (user_id, category, score, level)
        values (
            new.user_id,
            new.category,
            new.points,
            greatest(1, floor(ln(new.points)::integer))
        );
    end if;

    return new;
end;
$$ language plpgsql;

create trigger update_reputation
    after insert on user_reputation_history
    for each row
    execute procedure update_user_reputation();
