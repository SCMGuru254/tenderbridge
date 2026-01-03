-- Automatic Content Moderation Trigger
-- This script implements auto-flagging of content that receives 3 or more unique reports

CREATE OR REPLACE FUNCTION auto_moderate_content()
RETURNS TRIGGER AS $$
DECLARE
    report_count INTEGER;
BEGIN
    -- Count unique reporters for this content
    SELECT COUNT(DISTINCT reported_by) INTO report_count
    FROM public.content_reports
    WHERE content_id = NEW.content_id
    AND status = 'pending';

    -- If 3 or more reports, auto-flag or schedule for review
    IF report_count >= 3 THEN
        -- Case 1: Job Postings
        IF NEW.content_type = 'job' THEN
            UPDATE public.scraped_jobs
            SET is_scam = true
            WHERE id = NEW.content_id;
        
        -- Case 2: Discussions
        ELSIF NEW.content_type = 'discussion' THEN
            UPDATE public.discussions
            SET is_spam = true
            WHERE id = NEW.content_id;
        
        -- Default: Schedule for urgent review (72h window)
        END IF;

        -- Create a scheduled review if it doesn't exist
        INSERT INTO public.scheduled_reviews (content_id, content_type, report_id, scheduled_for)
        VALUES (NEW.content_id, NEW.content_type, NEW.id, now() + interval '24 hours')
        ON CONFLICT (content_id, content_type) DO UPDATE
        SET scheduled_for = LEAST(scheduled_reviews.scheduled_for, now() + interval '24 hours');
        
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS trigger_auto_mod ON public.content_reports;
CREATE TRIGGER trigger_auto_mod
    AFTER INSERT ON public.content_reports
    FOR EACH ROW
    EXECUTE FUNCTION auto_moderate_content();

-- Add unique constraint to scheduled_reviews to support ON CONFLICT
-- Note: You might need to adjust this depending on your existing schema
ALTER TABLE public.scheduled_reviews ADD CONSTRAINT unique_content_review UNIQUE (content_id, content_type);
