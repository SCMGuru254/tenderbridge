-- Remove any sample/fake news data and clean up the table
DELETE FROM supply_chain_news 
WHERE source_name IN ('Sample Source', 'Test Source', 'Fallback News') 
   OR title LIKE '%Sample%' 
   OR title LIKE '%Test%'
   OR content LIKE '%This is sample%'
   OR content LIKE '%This is a test%';