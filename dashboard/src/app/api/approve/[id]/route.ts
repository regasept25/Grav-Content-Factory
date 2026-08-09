import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest, context: any) {
  try {
    const runId = context.params.id;
    const { error } = await supabase
      .from('workflow_runs')
      .update({ status: 'running', current_step: 'narrative' })
      .eq('id', runId);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
