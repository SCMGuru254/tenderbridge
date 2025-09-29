-- Count records in each table
SELECT 
  (SELECT COUNT(*) FROM rss_feeds) as rss_feeds_count,
  (SELECT COUNT(*) FROM news_items) as news_items_count,
  (SELECT COUNT(*) FROM blog_posts) as blog_posts_count;

-- Check RSS feeds status
SELECT 
  title,
  last_fetched_at,
  fetch_error,
  active
FROM rss_feeds
ORDER BY last_fetched_at DESC NULLS LAST;

-- Check latest news items
SELECT 
  ni.title,
  ni.source,
  ni.published_at,
  rf.title as feed_title
FROM news_items ni
LEFT JOIN rss_feeds rf ON ni.rss_feed_id = rf.id
ORDER BY ni.published_at DESC
LIMIT 10;