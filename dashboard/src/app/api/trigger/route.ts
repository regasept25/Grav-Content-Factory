import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    let projectId = '99999999-9999-9999-9999-999999999999';
    const { data: proj } = await supabase.from('projects').select('id').limit(1).single();
    if (proj) {
      projectId = proj.id;
    } else {
      const { data: newProj } = await supabase.from('projects').insert({ title: 'Default Content Project' }).select('id').single();
      if (newProj) projectId = newProj.id;
    }

    const { data: run, error } = await supabase
      .from('workflow_runs')
      .insert({
        project_id: projectId,
        current_step: 'ideation',
        status: 'pending'
      })
      .select('id')
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, runId: run.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
