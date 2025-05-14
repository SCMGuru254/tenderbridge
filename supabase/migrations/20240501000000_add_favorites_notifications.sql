-- Add favorites and notifications features

-- Create user_job_preferences table to store favorites and reminders
CREATE TABLE IF NOT EXISTS user_job_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES scraped_jobs(id) ON DELETE CASCADE,
  is_favorite BOOLEAN DEFAULT FALSE,
  reminder_set BOOLEAN DEFAULT FALSE,
  reminder_time TIMESTAMPTZ,
  notification_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES scraped_jobs(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'reminder', 'new_job', etc.
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  scheduled_for TIMESTAMPTZ
);

-- Add date_posted field to scraped_jobs if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scraped_jobs' AND column_name = 'date_posted') THEN
    ALTER TABLE scraped_jobs ADD COLUMN date_posted DATE;
  END IF;
END $$;

-- Add tags field to scraped_jobs if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scraped_jobs' AND column_name = 'tags') THEN
    ALTER TABLE scraped_jobs ADD COLUMN tags TEXT[];
  END IF;
END $$;

-- Create function to set reminder notifications
CREATE OR REPLACE FUNCTION set_job_reminder()
RETURNS TRIGGER AS $$
BEGIN
  -- If reminder is set, create a notification scheduled for 4 hours later
  IF NEW.reminder_set = TRUE AND (OLD IS NULL OR OLD.reminder_set = FALSE OR NEW.reminder_time <> OLD.reminder_time) THEN
    -- Set reminder time to 4 hours from now if not specified
    IF NEW.reminder_time IS NULL THEN
      NEW.reminder_time := NOW() + INTERVAL '4 hours';
    END IF;
    
    -- Create notification
    INSERT INTO notifications (user_id, job_id, message, type, scheduled_for)
    VALUES (
      NEW.user_id, 
      NEW.job_id, 
      'Reminder to apply for job: ' || (SELECT title FROM scraped_jobs WHERE id = NEW.job_id),
      'reminder',
      NEW.reminder_time
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for reminders
DROP TRIGGER IF EXISTS job_reminder_trigger ON user_job_preferences;
CREATE TRIGGER job_reminder_trigger
AFTER INSERT OR UPDATE OF reminder_set, reminder_time
ON user_job_preferences
FOR EACH ROW
EXECUTE FUNCTION set_job_reminder();

-- Create RLS policies
ALTER TABLE user_job_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies for user_job_preferences
CREATE POLICY "Users can view their own job preferences"
ON user_job_preferences
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own job preferences"
ON user_job_preferences
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job preferences"
ON user_job_preferences
FOR UPDATE
USING (auth.uid() = user_id);

-- Policies for notifications
CREATE POLICY "Users can view their own notifications"
ON notifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON notifications
FOR UPDATE
USING (auth.uid() = user_id);