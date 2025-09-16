-- Fix RLS disabled issue by enabling RLS for all public tables that don't have it
-- The linter found some tables without RLS enabled

-- Check if there are tables without RLS and enable them
DO $$
DECLARE
    table_rec RECORD;
BEGIN
    -- Loop through all tables in public schema that don't have RLS enabled
    FOR table_rec IN 
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT IN (
            SELECT tablename 
            FROM pg_tables t
            JOIN pg_class c ON c.relname = t.tablename
            WHERE c.relrowsecurity = true
            AND t.schemaname = 'public'
        )
    LOOP
        -- Enable RLS for each table
        EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', table_rec.schemaname, table_rec.tablename);
        RAISE NOTICE 'Enabled RLS for table: %.%', table_rec.schemaname, table_rec.tablename;
    END LOOP;
END;
$$;