import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET ALL NICHES
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

// CREATE NEW NICHE
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
        llm_model: body.llm_model || 'gemini-2.0-flash',
        reasoning_model: body.reasoning_model || 'gemini-2.0-flash',
        aspect_ratio: body.aspect_ratio || '9:16',
        voice_provider: body.voice_provider || 'edge',
        voice_speed: Number(body.voice_speed || 1.0),
        system_instructions: body.system_instructions || ''
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
