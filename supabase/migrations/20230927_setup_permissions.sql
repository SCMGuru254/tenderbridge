-- Enable Row Level Security
ALTER TABLE rss_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for RSS feeds
CREATE POLICY "Enable read access for all users" ON rss_feeds
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON rss_feeds
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON rss_feeds
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for news items
CREATE POLICY "Enable read access for all users" ON news_items
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for service role" ON news_items
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Create policies for blog posts
CREATE POLICY "Enable read access for all users" ON blog_posts
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON blog_posts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT SELECT ON rss_feeds TO anon;
GRANT SELECT ON rss_feeds TO authenticated;
GRANT INSERT, UPDATE ON rss_feeds TO authenticated;

GRANT SELECT ON news_items TO anon;
GRANT SELECT ON news_items TO authenticated;
GRANT INSERT, UPDATE ON news_items TO service_role;

GRANT SELECT ON blog_posts TO anon;
GRANT SELECT ON blog_posts TO authenticated;
GRANT INSERT, UPDATE ON blog_posts TO authenticated;