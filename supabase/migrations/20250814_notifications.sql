-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('connection_request', 'connection_accepted', 'role_change', 'profile_view')),
    data JSONB NOT NULL DEFAULT '{}',
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_data CHECK (
        CASE type
            WHEN 'connection_request' THEN (data ? 'from_user' AND data ? 'from_user_name')
            WHEN 'connection_accepted' THEN (data ? 'user' AND data ? 'user_name')
            WHEN 'role_change' THEN (data ? 'role' AND data ? 'action')
            WHEN 'profile_view' THEN (data ? 'viewer' AND data ? 'viewer_name')
            ELSE false
        END
    )
);

-- Add RLS to notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

-- Add notification policies
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Create function to send notifications
CREATE OR REPLACE FUNCTION send_notification(
    p_user_id UUID,
    p_type TEXT,
    p_data JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO notifications (user_id, type, data)
    VALUES (p_user_id, p_type, p_data)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$;

-- Create trigger for connection requests
CREATE OR REPLACE FUNCTION notify_connection_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_notification_id UUID;
BEGIN
    -- Get sender's name
    WITH sender_info AS (
        SELECT full_name FROM profiles WHERE id = NEW.user_id1
    )
    SELECT send_notification(
        NEW.user_id2,
        'connection_request',
        jsonb_build_object(
            'from_user', NEW.user_id1,
            'from_user_name', (SELECT full_name FROM sender_info),
            'connection_id', NEW.id
        )
    ) INTO v_notification_id;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER connection_request_notification
AFTER INSERT ON connections
FOR EACH ROW
EXECUTE FUNCTION notify_connection_request();

-- Create trigger for accepted connections
CREATE OR REPLACE FUNCTION notify_connection_accepted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_notification_id UUID;
BEGIN
    IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
        -- Get accepter's name
        WITH accepter_info AS (
            SELECT full_name FROM profiles WHERE id = NEW.user_id2
        )
        SELECT send_notification(
            NEW.user_id1,
            'connection_accepted',
            jsonb_build_object(
                'user', NEW.user_id2,
                'user_name', (SELECT full_name FROM accepter_info),
                'connection_id', NEW.id
            )
        ) INTO v_notification_id;
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER connection_accepted_notification
AFTER UPDATE ON connections
FOR EACH ROW
EXECUTE FUNCTION notify_connection_accepted();

-- Create trigger for profile views
CREATE OR REPLACE FUNCTION notify_profile_view()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_notification_id UUID;
    v_viewer_name TEXT;
BEGIN
    -- Get viewer's name
    SELECT full_name INTO v_viewer_name
    FROM profiles
    WHERE id = NEW.viewer_id;

    -- Send notification if profile owner wants to be notified
    IF EXISTS (
        SELECT 1 FROM profiles
        WHERE id = NEW.profile_id
        AND notify_on_view = true
    ) THEN
        PERFORM send_notification(
            NEW.profile_id,
            'profile_view',
            jsonb_build_object(
                'viewer', NEW.viewer_id,
                'viewer_name', v_viewer_name
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER profile_view_notification
AFTER INSERT ON profile_views
FOR EACH ROW
EXECUTE FUNCTION notify_profile_view();

-- Create trigger for role changes
CREATE OR REPLACE FUNCTION notify_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_notification_id UUID;
BEGIN
    -- Send notification for role changes
    PERFORM send_notification(
        NEW.user_id,
        'role_change',
        jsonb_build_object(
            'role', NEW.role,
            'action', TG_OP
        )
    );
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER role_change_notification
AFTER INSERT OR DELETE ON user_roles
FOR EACH ROW
EXECUTE FUNCTION notify_role_change();

-- Add indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Create cleanup function for old notifications
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM notifications
    WHERE created_at < NOW() - INTERVAL '30 days'
    AND read = true;
END;
$$;
