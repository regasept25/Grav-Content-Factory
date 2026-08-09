'use client';

import { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Layers, 
  Sparkles, 
  FileText, 
  Image as ImageIcon, 
  Volume2, 
  AlignLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

interface Idea {
  id: string;
  title: string;
  hook: string;
  body: string;
  is_selected: boolean;
}

interface WorkflowRun {
  id: string;
  project_id: string;
  current_step: string;
  status: string;
  created_at: string;
  content_ideas?: Idea[];
}

export default function Dashboard() {
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const fetchRuns = async () => {
    try {
      const res = await fetch('/api/runs');
      const data = await res.json();
      if (Array.isArray(data)) {
        setRuns(data);
      }
    } catch (err) {
      console.error('Failed to fetch workflow runs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRuns();
    const interval = setInterval(fetchRuns, 5000);
    return () => clearInterval(interval);
  }, []);

  const triggerNewRun = async () => {
    setTriggering(true);
    try {
      const res = await fetch('/api/trigger', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchRuns();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTriggering(false);
    }
  };

  const approveRun = async (runId: string) => {
    setApprovingId(runId);
    try {
      const res = await fetch(`/api/approve/${runId}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchRuns();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setApprovingId(null);
    }
  };

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'ideation': return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'narrative': return <FileText className="w-4 h-4 text-emerald-400" />;
      case 'prompts': return <Layers className="w-4 h-4 text-emerald-400" />;
      case 'images': return <ImageIcon className="w-4 h-4 text-emerald-400" />;
      case 'voiceover': return <Volume2 className="w-4 h-4 text-emerald-400" />;
      case 'caption': return <AlignLeft className="w-4 h-4 text-emerald-400" />;
      default: return <ChevronRight className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paused_for_approval':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> NEED APPROVAL
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3.5 h-3.5" /> COMPLETED
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5" /> FAILED
          </span>
        );
      case 'running':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> RUNNING
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-neutral-800 text-neutral-400 border border-neutral-700">
            {status.toUpperCase()}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#fafafa] p-4 sm:p-8">
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2e2e2e] pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#3ecf8e] rounded-lg flex items-center justify-center font-bold text-[#0f0f0f] text-lg shadow-lg shadow-emerald-500/15">
            G
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Grav Content Factory</h1>
            <p className="text-sm text-[#898989] font-mono">Status & Orchestrator Dashboard</p>
          </div>
        </div>
        
        <button
          onClick={triggerNewRun}
          disabled={triggering}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#3ecf8e] hover:bg-[#00c573] disabled:bg-[#3ecf8e]/50 text-[#0f0f0f] font-semibold px-6 py-3 rounded-full text-sm transition-all duration-200 shadow-md shadow-emerald-500/10 active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" />
          {triggering ? 'Memicu...' : 'Picu Content Flow Baru'}
        </button>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#171717] border border-[#2e2e2e] rounded-2xl p-6">
            <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#3ecf8e]" />
              Antrean Alur Kerja Aktif
            </h2>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-[#898989] gap-3">
                <RefreshCw className="w-8 h-8 animate-spin text-[#3ecf8e]" />
                <p className="text-sm font-mono">Memuat data dari Supabase...</p>
              </div>
            ) : runs.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-[#2e2e2e] rounded-xl">
                <p className="text-[#898989] text-sm">Belum ada alur kerja (runs) yang berjalan.</p>
                <button 
                  onClick={triggerNewRun}
                  className="mt-4 text-xs font-semibold text-[#3ecf8e] hover:text-[#00c573]"
                >
                  Buat Run Pertama Sekarang →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {runs.map((run) => (
                  <div 
                    key={run.id} 
                    className="border border-[#2e2e2e] hover:border-[#363636] rounded-xl p-5 bg-white/[0.01] transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <div className="text-xs font-mono text-[#898989] mb-1">RUN ID</div>
                        <div className="font-semibold text-sm font-mono text-[#efefef]">{run.id}</div>
                      </div>
                      <div className="self-start sm:self-center">
                        {getStatusBadge(run.status)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#2e2e2e]/50 pt-4">
                      <div>
                        <span className="text-xs text-[#898989] block mb-1">Langkah Saat Ini</span>
                        <div className="flex items-center gap-2 bg-[#0f0f0f] border border-[#2e2e2e] rounded-lg px-3 py-2 text-sm font-mono w-fit">
                          {getStepIcon(run.current_step)}
                          <span className="text-[#3ecf8e]">{run.current_step.toUpperCase()}</span>
                        </div>
                      </div>

                      {run.status === 'paused_for_approval' && (
                        <div className="flex items-end justify-start md:justify-end">
                          <button
                            onClick={() => approveRun(run.id)}
                            disabled={approvingId === run.id}
                            className="bg-[#3ecf8e] hover:bg-[#00c573] disabled:bg-[#3ecf8e]/50 text-[#0f0f0f] font-semibold text-xs px-4 py-2.5 rounded-lg transition-all active:scale-95 flex items-center gap-1.5"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            {approvingId === run.id ? 'Memproses...' : 'Setujui & Lanjutkan'}
                          </button>
                        </div>
                      )}
                    </div>

                    {run.content_ideas && run.content_ideas.length > 0 && (
                      <div className="mt-4 p-4 rounded-xl border border-[#2e2e2e] bg-[#0f0f0f]/80">
                        <span className="text-[10px] font-mono text-[#898989] uppercase tracking-wider block mb-2">💡 Draf Ide Konten</span>
                        {run.content_ideas.map((idea) => (
                          <div key={idea.id} className="space-y-1.5">
                            <h4 className="font-medium text-sm text-[#fafafa]">{idea.title}</h4>
                            <p className="text-xs text-[#b4b4b4] leading-relaxed"><strong>Hook:</strong> &quot;{idea.hook}&quot;</p>
                            <p className="text-xs text-[#898989] leading-relaxed line-clamp-2">{idea.body}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-[10px] font-mono text-[#898989] mt-4 flex items-center justify-between">
                      <span>Dibuat: {new Date(run.created_at).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#171717] border border-[#2e2e2e] rounded-2xl p-6">
            <h3 className="text-lg font-medium mb-6">Ringkasan Pipeline</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-[#2e2e2e]/50">
                <span className="text-sm text-[#b4b4b4]">Total Antrean</span>
                <span className="font-mono font-bold text-[#fafafa]">{runs.length}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#2e2e2e]/50">
                <span className="text-sm text-[#b4b4b4]">Butuh Persetujuan</span>
                <span className="font-mono font-bold text-amber-400">
                  {runs.filter(r => r.status === 'paused_for_approval').length}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#2e2e2e]/50">
                <span className="text-sm text-[#b4b4b4]">Selesai</span>
                <span className="font-mono font-bold text-emerald-400">
                  {runs.filter(r => r.status === 'completed').length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#171717] border border-[#2e2e2e] rounded-2xl p-6">
            <h3 className="text-sm font-mono text-[#898989] mb-4 uppercase tracking-wider">Petunjuk Integrasi</h3>
            <p className="text-xs text-[#b4b4b4] leading-relaxed mb-3">
              Dashboard ini disinkronisasikan langsung ke Supabase database.
            </p>
            <p className="text-xs text-[#b4b4b4] leading-relaxed">
              Semua persetujuan yang dilakukan di browser akan secara otomatis diteruskan ke worker lokal untuk melanjutkan proses narasi, visual prompt, dan generator gambar Playwright.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
