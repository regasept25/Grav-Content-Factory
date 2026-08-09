import { supabase } from './services/supabase';
async function test() {
  const query = `
    CREATE TABLE IF NOT EXISTS niches (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      reference_images TEXT[],
      logo_url TEXT,
      llm_model VARCHAR(100) DEFAULT 'gemini-2.0-flash',
      reasoning_model VARCHAR(100) DEFAULT 'gemini-2.0-flash',
      aspect_ratio VARCHAR(20) DEFAULT '9:16',
      voice_provider VARCHAR(50) DEFAULT 'edge',
      voice_speed NUMERIC DEFAULT 1.0,
      system_instructions TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sub_agent_configs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      agent_name VARCHAR(100) UNIQUE NOT NULL,
      llm_model VARCHAR(100) DEFAULT 'gemini-2.0-flash',
      system_prompt TEXT,
      temperature NUMERIC DEFAULT 0.7,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    ALTER TABLE projects ADD COLUMN IF NOT EXISTS niche_id UUID REFERENCES niches(id) ON DELETE SET NULL;
  `;
  const { data, error } = await supabase.rpc('execute_sql_query', { query_text: query });
  console.log('Migrasi Niche Result:', data, 'Error:', error);
}
test();
