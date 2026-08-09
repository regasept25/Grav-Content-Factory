import { supabase } from './services/supabase';

async function run() {
  const query = `
    -- Tabel Niche
    CREATE TABLE IF NOT EXISTS niches (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      reference_images TEXT[],
      logo_url TEXT,
      
      -- Custom LLM & Provider Setting per Niche
      custom_llm_provider VARCHAR(50) DEFAULT 'google', -- 'google', 'openai', 'custom_router', 'openrouter'
      custom_llm_base_url TEXT, -- API Base URL custom
      custom_llm_api_key TEXT, -- API Key/Token custom
      custom_llm_model VARCHAR(100) DEFAULT 'gemini-2.0-flash',
      
      -- Setelan Layout & Voice
      aspect_ratio VARCHAR(20) DEFAULT '9:16',
      voice_provider VARCHAR(50) DEFAULT 'edge',
      voice_speed NUMERIC DEFAULT 1.0,
      
      -- Config detail Sub-Agent spesifik untuk Niche ini
      ideation_prompt TEXT,
      ideation_model VARCHAR(100) DEFAULT 'gemini-2.0-flash',
      ideation_temp NUMERIC DEFAULT 0.7,
      
      narrative_prompt TEXT,
      narrative_model VARCHAR(100) DEFAULT 'gemini-2.0-flash',
      narrative_temp NUMERIC DEFAULT 0.7,
      
      image_prompt_prompt TEXT,
      image_prompt_model VARCHAR(100) DEFAULT 'gemini-2.0-flash',
      image_prompt_temp NUMERIC DEFAULT 0.7,
      
      caption_prompt TEXT,
      caption_model VARCHAR(100) DEFAULT 'gemini-2.0-flash',
      caption_temp NUMERIC DEFAULT 0.7,
      
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Tambah kolom niche_id di projects jika belum ada
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS niche_id UUID REFERENCES niches(id) ON DELETE SET NULL;
  `;

  console.log('Menjalankan RPC execute_sql_query untuk migrasi Niche baru...');
  const { data, error } = await supabase.rpc('execute_sql_query', { query_text: query });
  console.log('Result:', data, 'Error:', error);
}

run();
