-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    author TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create RSS feeds table
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

-- Create news_items table with RSS feed reference
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

-- Create index on created_at for better performance when sorting
CREATE INDEX IF NOT EXISTS blog_posts_created_at_idx ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS news_items_created_at_idx ON news_items(created_at DESC);
CREATE INDEX IF NOT EXISTS rss_feeds_created_at_idx ON rss_feeds(created_at DESC);

-- Create tags GIN index for better performance when filtering by tags
CREATE INDEX IF NOT EXISTS blog_posts_tags_idx ON blog_posts USING GIN (tags);
CREATE INDEX IF NOT EXISTS news_items_tags_idx ON news_items USING GIN (tags);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_items_updated_at
    BEFORE UPDATE ON news_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rss_feeds_updated_at
    BEFORE UPDATE ON rss_feeds
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert the real RSS feeds
INSERT INTO rss_feeds (title, url, description, category) VALUES
('Tenderzville Portal', 'https://tenderzville-portal.co.ke/feed/', 'Kenyan tenders and procurement news', 'Local'),
('All Things Supply Chain', 'https://www.allthingssupplychain.com/feed/', 'Comprehensive supply chain coverage and insights', 'Global'),
('Supply Chain Brain', 'https://www.supplychainbrain.com/rss/articles', 'Expert analysis and industry news', 'Global'),
('SCM Dojo', 'https://www.scmdojo.com/feed/', 'Supply chain management expertise and training', 'Education'),
('Supply Chain Today', 'https://www.supplychaintoday.com/feed/', 'Current supply chain news and trends', 'News'),
('Supply Chain Shaman', 'https://www.supplychainshaman.com/feed/', 'Industry thought leadership and analysis', 'Analysis'),
('SCM Research', 'https://scmresearch.org/feed/', 'Academic and practical supply chain research', 'Research');

-- Insert some sample data for testing
INSERT INTO blog_posts (title, content, tags, author) VALUES
('Introduction to Supply Chain Management', 'Supply chain management is the handling of the entire production flow of a good or service...', ARRAY['Supply Chain', 'Management', 'Introduction'], 'John Doe'),
('Digital Transformation in Logistics', 'Technology is revolutionizing how we manage logistics...', ARRAY['Technology', 'Logistics', 'Digital'], 'Jane Smith'),
('Sustainable Supply Chains', 'Sustainability in supply chains is becoming increasingly important...', ARRAY['Sustainability', 'Environment', 'Supply Chain'], 'Mike Johnson');

INSERT INTO news_items (title, content, source, source_url, tags, published_at) VALUES
('New Logistics Hub Opens in Nairobi', 'A state-of-the-art logistics hub has opened in Nairobi...', 'Supply Chain News', 'https://example.com/news1', ARRAY['Logistics', 'Kenya', 'Infrastructure'], CURRENT_TIMESTAMP),
('Global Supply Chain Trends 2025', 'Industry experts predict major shifts in supply chain management...', 'Industry Weekly', 'https://example.com/news2', ARRAY['Trends', 'Global', 'Future'], CURRENT_TIMESTAMP),
('Sustainable Packaging Solutions', 'Companies are adopting eco-friendly packaging...', 'Green Supply Chain', 'https://example.com/news3', ARRAY['Sustainability', 'Packaging'], CURRENT_TIMESTAMP);