import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET ALL AGENT CONFIGS OR SEED DEFAULT
export async function GET() {
  try {
    const { data: configs, error } = await supabase
      .from('sub_agent_configs')
      .select('*');

    if (error) throw error;
    return NextResponse.json(configs || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// SAVE / UPDATE AGENT CONFIG
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('sub_agent_configs')
      .upsert({
        agent_name: body.agent_name,
        llm_model: body.llm_model || 'gemini-2.0-flash',
        system_prompt: body.system_prompt || '',
        temperature: Number(body.temperature || 0.7)
      }, {
        onConflict: 'agent_name'
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
