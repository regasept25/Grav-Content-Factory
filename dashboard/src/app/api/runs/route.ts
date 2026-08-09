import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: runs, error } = await supabase
      .from('workflow_runs')
      .select('*, content_ideas(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(runs || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
