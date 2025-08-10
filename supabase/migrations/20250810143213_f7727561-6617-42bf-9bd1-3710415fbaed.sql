-- Update extensions to recommended versions where possible
-- Attempt to update pgcrypto (used for gen_random_uuid)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto'
  ) THEN
    EXECUTE 'ALTER EXTENSION pgcrypto UPDATE';
  END IF;
END $$;