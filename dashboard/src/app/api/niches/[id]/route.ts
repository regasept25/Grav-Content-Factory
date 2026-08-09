import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET SINGLE NICHE & UPDATE / DELETE
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
        llm_model: body.llm_model,
        reasoning_model: body.reasoning_model,
        aspect_ratio: body.aspect_ratio,
        voice_provider: body.voice_provider,
        voice_speed: Number(body.voice_speed),
        system_instructions: body.system_instructions,
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
