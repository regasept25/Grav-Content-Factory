-- 1. Jalankan SQL ini di Dashboard Supabase SQL Editor Abang untuk mengizinkan Hermes menjalankan migrasi/query langsung secara aman dari backend.
CREATE OR REPLACE FUNCTION execute_sql_query(query_text text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    EXECUTE query_text;
END;
$$;
