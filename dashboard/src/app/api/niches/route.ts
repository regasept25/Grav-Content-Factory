import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET ALL NICHES WITH EXTENDED COLUMNS
export async function GET() {
  try {
    const { data: niches, error } = await supabase
      .from('niches')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(niches || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// CREATE NEW NICHE WITH DETAILED AGENT & CUSTOM LLM SETTINGS
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('niches')
      .insert({
        name: body.name,
        description: body.description,
        reference_images: body.reference_images || [],
        logo_url: body.logo_url || '',
        
        // Custom LLM Settings
        custom_llm_provider: body.custom_llm_provider || 'google',
        custom_llm_base_url: body.custom_llm_base_url || '',
        custom_llm_api_key: body.custom_llm_api_key || '',
        custom_llm_model: body.custom_llm_model || 'gemini-2.0-flash',
        
        // Settings layout/voice
        aspect_ratio: body.aspect_ratio || '9:16',
        voice_provider: body.voice_provider || 'edge',
        voice_speed: Number(body.voice_speed || 1.0),
        
        // Sub-Agent: Ideation
        ideation_prompt: body.ideation_prompt || '',
        ideation_model: body.ideation_model || 'gemini-2.0-flash',
        ideation_temp: Number(body.ideation_temp ?? 0.7),
        
        // Sub-Agent: Narrative
        narrative_prompt: body.narrative_prompt || '',
        narrative_model: body.narrative_model || 'gemini-2.0-flash',
        narrative_temp: Number(body.narrative_temp ?? 0.7),
        
        // Sub-Agent: Image Prompt
        image_prompt_prompt: body.image_prompt_prompt || '',
        image_prompt_model: body.image_prompt_model || 'gemini-2.0-flash',
        image_prompt_temp: Number(body.image_prompt_temp ?? 0.7),
        
        // Sub-Agent: Caption
        caption_prompt: body.caption_prompt || '',
        caption_model: body.caption_model || 'gemini-2.0-flash',
        caption_temp: Number(body.caption_temp ?? 0.7)
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
