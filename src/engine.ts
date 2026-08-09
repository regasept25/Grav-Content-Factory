import { supabase } from './services/supabase';
import { IdeationAgent } from './agents/ideation';
import { NarrativeAgent } from './agents/narrative';
import { ImagePromptAgent } from './agents/image-prompt';
import { CaptionAgent } from './agents/caption';
import { TelegramSupervisorAgent } from './agents/supervisor';

export class WorkflowEngine {
  private supervisor: TelegramSupervisorAgent;
  private ideation: IdeationAgent;
  private narrative: NarrativeAgent;
  private imagePrompt: ImagePromptAgent;
  private caption: CaptionAgent;

  constructor() {
    this.supervisor = new TelegramSupervisorAgent();
    this.ideation = new IdeationAgent();
    this.narrative = new NarrativeAgent();
    this.imagePrompt = new ImagePromptAgent();
    this.caption = new CaptionAgent();
  }

  async createNewProject(title: string) {
    // 1. Insert Project
    const { data: project, error: pError } = await supabase
      .from('projects')
      .insert({ title, status: 'in_progress' })
      .select()
      .single();

    if (pError) throw pError;

    // 2. Insert Workflow Run
    const { data: run, error: rError } = await supabase
      .from('workflow_runs')
      .insert({ project_id: project.id, current_step: 'ideation', status: 'running' })
      .select()
      .single();

    if (rError) throw rError;

    this.supervisor.sendReport(`🎬 *Project Baru Dimulai*: "${title}"\nSub-agent sedang bekerja merancang ide...`);
    
    // Start Async execution
    this.executeWorkflow(run.id, title);
    
    return { projectId: project.id, workflowRunId: run.id };
  }

  private async executeWorkflow(runId: string, topic: string) {
    try {
      // --- STEP 1: IDEATION ---
      const ideas = await this.ideation.run(topic, 3);
      
      // Save ideas to DB
      const dbIdeas = ideas.map(idea => ({
        workflow_run_id: runId,
        title: idea.title,
        hook: idea.hook,
        body: idea.body
      }));
      
      const { error: ideaError } = await supabase.from('content_ideas').insert(dbIdeas);
      if (ideaError) throw ideaError;

      // Ask Supervisor / User to select an idea
      const selectedIndex = await this.supervisor.requestIdeaSelection(runId, ideas);
      const selectedIdea = ideas[selectedIndex];
      if (!selectedIdea) {
        throw new Error('No selected idea found.');
      }

      // Update selection in DB
      await supabase
        .from('content_ideas')
        .update({ is_selected: true })
        .eq('workflow_run_id', runId)
        .eq('title', selectedIdea.title);

      await supabase
        .from('workflow_runs')
        .update({ current_step: 'narrative', status: 'running' })
        .eq('id', runId);

      this.supervisor.sendReport(`🎯 Ide terpilih: *"${selectedIdea.title}"*\nSub-agent sekarang membuat Narasi video...`);

      // --- STEP 2: NARRATIVE ---
      const narrative = await this.narrative.run(selectedIdea.title, selectedIdea.hook, selectedIdea.body);
      
      // Save narrative to DB
      await supabase.from('content_narratives').insert({
        workflow_run_id: runId,
        script_text: narrative.scriptText,
        visual_notes: narrative.visualNotes
      });

      await supabase
        .from('workflow_runs')
        .update({ current_step: 'prompts', status: 'running' })
        .eq('id', runId);

      this.supervisor.sendReport(`📝 *Narasi & Visual Notes Selesai*.\n\n*Naskah*:\n"${narrative.scriptText}"\n\nSub-agent sedang merancang prompt gambar...`);

      // --- STEP 3: IMAGE PROMPTS ---
      const prompts = await this.imagePrompt.run(narrative.scriptText, narrative.visualNotes, '9:16');
      
      // Save prompts to DB
      const dbPrompts = prompts.map(p => ({
        workflow_run_id: runId,
        scene_number: p.sceneNumber,
        prompt_text: p.promptText,
        negative_prompt: p.negativePrompt,
        aspect_ratio: p.aspectRatio,
        status: 'pending'
      }));

      await supabase.from('image_prompts').insert(dbPrompts);

      // --- STEP 4: CAPTION & HASHTAGS ---
      const caption = await this.caption.run(selectedIdea.title, narrative.scriptText);
      
      await supabase.from('captions').insert({
        workflow_run_id: runId,
        caption_text: caption.captionText,
        hashtags: caption.hashtags
      });

      // Update Workflow to pause for Image generation (Local Worker) & VO
      await supabase
        .from('workflow_runs')
        .update({ current_step: 'images', status: 'paused_for_approval' })
        .eq('id', runId);

      this.supervisor.sendReport(`🎨 *Prompt Gambar & Caption Selesai*.\n\n*Caption*:\n${caption.captionText}\n\n*Hashtags*: ${caption.hashtags}\n\n🤖 *Menunggu Local Worker* untuk men-generate gambar menggunakan Google Labs Flow.`);

    } catch (error: any) {
      console.error(error);
      await supabase.from('workflow_runs').update({ status: 'failed' }).eq('id', runId);
      this.supervisor.sendReport(`❌ *Workflow Gagal*: ${error.message || error}`);
    }
  }
}
