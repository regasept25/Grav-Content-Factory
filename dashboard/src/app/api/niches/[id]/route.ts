import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET SINGLE NICHE & UPDATE / DELETE WITH EXTENDED CONFIG
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { data: niche, error } = await supabase
      .from('niches')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return NextResponse.json(niche);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { data, error } = await supabase
      .from('niches')
      .update({
        name: body.name,
        description: body.description,
        reference_images: body.reference_images,
        logo_url: body.logo_url,
        
        // Custom LLM Settings
        custom_llm_provider: body.custom_llm_provider,
        custom_llm_base_url: body.custom_llm_base_url,
        custom_llm_api_key: body.custom_llm_api_key,
        custom_llm_model: body.custom_llm_model,
        
        // Settings layout/voice
        aspect_ratio: body.aspect_ratio,
        voice_provider: body.voice_provider,
        voice_speed: Number(body.voice_speed),
        
        // Sub-Agent: Ideation
        ideation_prompt: body.ideation_prompt,
        ideation_model: body.ideation_model,
        ideation_temp: Number(body.ideation_temp),
        
        // Sub-Agent: Narrative
        narrative_prompt: body.narrative_prompt,
        narrative_model: body.narrative_model,
        narrative_temp: Number(body.narrative_temp),
        
        // Sub-Agent: Image Prompt
        image_prompt_prompt: body.image_prompt_prompt,
        image_prompt_model: body.image_prompt_model,
        image_prompt_temp: Number(body.image_prompt_temp),
        
        // Sub-Agent: Caption
        caption_prompt: body.caption_prompt,
        caption_model: body.caption_model,
        caption_temp: Number(body.caption_temp),
        
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { error } = await supabase
      .from('niches')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
