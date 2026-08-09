import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://tpsqmcziztcdulusiczq.supabase.co',
  process.env.SUPABASE_KEY || ''
);

async function run() {
  const query = `
    CREATE TABLE IF NOT EXISTS niches (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      reference_images TEXT[], -- Array URL gambar referensi
      logo_url TEXT, -- Logo branding watermark
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
      agent_name VARCHAR(100) UNIQUE NOT NULL, -- 'ideation', 'narrative', 'image_prompt', 'caption'
      llm_model VARCHAR(100) DEFAULT 'gemini-2.0-flash',
      system_prompt TEXT,
      temperature NUMERIC DEFAULT 0.7,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Tambahkan relasi niche_id di projects
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS niche_id UUID REFERENCES niches(id) ON DELETE SET NULL;
  `;

  console.log('Membuat tabel schema niche...');
  const { error } = await supabase.rpc('execute_sql_query', { query_text: query });
  
  if (error) {
    console.error('RPC Error, mencoba run direct query alternative...');
    // Jika RPC custom execute_sql_query tidak terdaftar, user bisa jalankan via Supabase Dashboard SQL Editor
    console.log('\n--- SILAKAN SALIN SQL BERIKUT KE SQL EDITOR DASHBOARD SUPABASE ABANG ---\n');
    console.log(query);
    console.log('\n-------------------------------------------------------------------\n');
  } else {
    console.log('Tabel niches dan agent configs berhasil dibuat!');
  }
}

run();
