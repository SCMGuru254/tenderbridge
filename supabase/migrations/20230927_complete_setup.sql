-- Step 1: Create tables first
CREATE TABLE IF NOT EXISTS rss_feeds (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT,
    active BOOLEAN DEFAULT true,
    last_fetched_at TIMESTAMP WITH TIME ZONE,
    fetch_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source TEXT,
    source_url TEXT,
    image_url TEXT,
    rss_feed_id UUID REFERENCES rss_feeds(id),
    guid TEXT,
    tags TEXT[] DEFAULT '{}',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(rss_feed_id, guid)
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    author TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Create indices for better performance
CREATE INDEX IF NOT EXISTS rss_feeds_created_at_idx ON rss_feeds(created_at DESC);
CREATE INDEX IF NOT EXISTS news_items_created_at_idx ON news_items(created_at DESC);
CREATE INDEX IF NOT EXISTS blog_posts_created_at_idx ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS blog_posts_tags_idx ON blog_posts USING GIN (tags);
CREATE INDEX IF NOT EXISTS news_items_tags_idx ON news_items USING GIN (tags);

-- Step 3: Enable Row Level Security
ALTER TABLE rss_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Step 4: Create security policies
CREATE POLICY "Enable read access for all users" ON rss_feeds
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON rss_feeds
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON rss_feeds
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON news_items
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for service role" ON news_items
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Enable read access for all users" ON blog_posts
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON blog_posts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Step 5: Grant permissions
GRANT SELECT ON rss_feeds TO anon;
GRANT SELECT ON rss_feeds TO authenticated;
GRANT INSERT, UPDATE ON rss_feeds TO authenticated;

GRANT SELECT ON news_items TO anon;
GRANT SELECT ON news_items TO authenticated;
GRANT INSERT, UPDATE ON news_items TO service_role;

GRANT SELECT ON blog_posts TO anon;
GRANT SELECT ON blog_posts TO authenticated;
GRANT INSERT, UPDATE ON blog_posts TO authenticated;

-- Step 6: Insert the real RSS feeds
INSERT INTO rss_feeds (title, url, description, category) VALUES
('Tenderzville Portal', 'https://tenderzville-portal.co.ke/feed/', 'Kenyan tenders and procurement news', 'Local'),
('All Things Supply Chain', 'https://www.allthingssupplychain.com/feed/', 'Comprehensive supply chain coverage and insights', 'Global'),
('Supply Chain Brain', 'https://www.supplychainbrain.com/rss/articles', 'Expert analysis and industry news', 'Global'),
('SCM Dojo', 'https://www.scmdojo.com/feed/', 'Supply chain management expertise and training', 'Education'),
('Supply Chain Today', 'https://www.supplychaintoday.com/feed/', 'Current supply chain news and trends', 'News'),
('Supply Chain Shaman', 'https://www.supplychainshaman.com/feed/', 'Industry thought leadership and analysis', 'Analysis'),
('SCM Research', 'https://scmresearch.org/feed/', 'Academic and practical supply chain research', 'Research');