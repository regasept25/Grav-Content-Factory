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
  Bookmark, 
  Plus, 
  Trash2, 
  Save, 
  RefreshCw,
  Cpu,
  Globe,
  Key,
  HelpCircle,
  Loader2
} from 'lucide-react';

interface WorkflowRun {
  id: string;
  project_title: string;
  current_step: string;
  status: string;
  created_at: string;
}

interface Niche {
  id?: string;
  name: string;
  description: string;
  reference_images: string[];
  logo_url: string;
  
  // Custom LLM per Niche
  custom_llm_provider: string; // 'google', 'openai', 'custom_router', 'openrouter'
  custom_llm_base_url: string;
  custom_llm_api_key: string;
  custom_llm_model: string;
  
  // Layout & Voice
  aspect_ratio: string;
  voice_provider: string;
  voice_speed: number;
  
  // Sub-Agents Configs
  ideation_prompt: string;
  ideation_model: string;
  ideation_temp: number;
  
  narrative_prompt: string;
  narrative_model: string;
  narrative_temp: number;
  
  image_prompt_prompt: string;
  image_prompt_model: string;
  image_prompt_temp: number;
  
  caption_prompt: string;
  caption_model: string;
  caption_temp: number;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'niches'>('dashboard');
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [niches, setNiches] = useState<Niche[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<Niche | null>(null);

  // Loading States for Buttons (Submit/Actions)
  const [isSubmittingNiche, setIsSubmittingNiche] = useState(false);
  const [isTriggeringRun, setIsTriggeringRun] = useState(false);
  const [approvingRunId, setApprovingRunId] = useState<string | null>(null);
  const [deletingNicheId, setDeletingNicheId] = useState<string | null>(null);

  // Form states for Niche & Agent Integration
  const [newNiche, setNewNiche] = useState<Niche>({
    name: '',
    description: '',
    reference_images: [],
    logo_url: '',
    custom_llm_provider: 'google',
    custom_llm_base_url: '',
    custom_llm_api_key: '',
    custom_llm_model: 'gemini-2.0-flash',
    aspect_ratio: '9:16',
    voice_provider: 'edge',
    voice_speed: 1.0,
    ideation_prompt: '',
    ideation_model: 'gemini-2.0-flash',
    ideation_temp: 0.7,
    narrative_prompt: '',
    narrative_model: 'gemini-2.0-flash',
    narrative_temp: 0.7,
    image_prompt_prompt: '',
    image_prompt_model: 'gemini-2.0-flash',
    image_prompt_temp: 0.7,
    caption_prompt: '',
    caption_model: 'gemini-2.0-flash',
    caption_temp: 0.7
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [runsRes, nichesRes] = await Promise.all([
        fetch('/api/runs'),
        fetch('/api/niches')
      ]);

      const runsData = await runsRes.json();
      const nichesData = await nichesRes.json();

      setRuns(Array.isArray(runsData) ? runsData : []);
      setNiches(Array.isArray(nichesData) ? nichesData : []);
    } catch (e) {
      console.error('Error fetching data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerNewRun = async () => {
    const topic = prompt('Masukkan Topik atau Ide Konten Utama:');
    if (!topic) return;

    setIsTriggeringRun(true);
    try {
      const res = await fetch('/api/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (e) {
      alert('Gagal memicu content flow');
    } finally {
      setIsTriggeringRun(false);
    }
  };

  const handleApprove = async (runId: string) => {
    setApprovingRunId(runId);
    try {
      const res = await fetch(`/api/approve/${runId}`, { method: 'POST' });
      if (res.ok) {
        await fetchData();
      }
    } catch (e) {
      alert('Gagal menyetujui ide');
    } finally {
      setApprovingRunId(null);
    }
  };

  const handleSaveNiche = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingNiche(true);
    try {
      const isEdit = Boolean(newNiche.id);
      const url = isEdit ? `/api/niches/${newNiche.id}` : '/api/niches';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNiche)
      });

      if (res.ok) {
        setNewNiche({
          name: '',
          description: '',
          reference_images: [],
          logo_url: '',
          custom_llm_provider: 'google',
          custom_llm_base_url: '',
          custom_llm_api_key: '',
          custom_llm_model: 'gemini-2.0-flash',
          aspect_ratio: '9:16',
          voice_provider: 'edge',
          voice_speed: 1.0,
          ideation_prompt: '',
          ideation_model: 'gemini-2.0-flash',
          ideation_temp: 0.7,
          narrative_prompt: '',
          narrative_model: 'gemini-2.0-flash',
          narrative_temp: 0.7,
          image_prompt_prompt: '',
          image_prompt_model: 'gemini-2.0-flash',
          image_prompt_temp: 0.7,
          caption_prompt: '',
          caption_model: 'gemini-2.0-flash',
          caption_temp: 0.7
        });
        setSelectedNiche(null);
        await fetchData();
      } else {
        const err = await res.json();
        alert('Gagal menyimpan Niche: ' + err.error);
      }
    } catch (e) {
      alert('Error saving niche');
    } finally {
      setIsSubmittingNiche(false);
    }
  };

  const handleDeleteNiche = async (id?: string) => {
    if (!id || !confirm('Hapus Niche Profile ini beserta semua konfigurasinya?')) return;
    setDeletingNicheId(id);
    try {
      const res = await fetch(`/api/niches/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (newNiche.id === id) {
          setSelectedNiche(null);
        }
        await fetchData();
      }
    } catch (e) {
      alert('Gagal menghapus niche');
    } finally {
      setDeletingNicheId(null);
    }
  };

  const startEditNiche = (niche: Niche) => {
    setSelectedNiche(niche);
    setNewNiche({ ...niche });
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] font-sans">
      {/* Header */}
      <header className="border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-black text-lg">
              G
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wide text-white">Grav Content CRM</h1>
              <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                SUPERVISOR CONNECTED
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition ${activeTab === 'dashboard' ? 'bg-[#27272a] text-white' : 'text-[#a1a1aa] hover:text-white'}`}
            >
              Dashboard Queue
            </button>
            <button 
              onClick={() => setActiveTab('niches')}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition ${activeTab === 'niches' ? 'bg-[#27272a] text-white' : 'text-[#a1a1aa] hover:text-white'}`}
            >
              Niche Profiles & Agents
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Antrean Alur Kerja Aktif</h2>
                <p className="text-xs text-[#a1a1aa] mt-1">Real-time update dari pipeline Content Factory</p>
              </div>
              <button 
                onClick={triggerNewRun}
                disabled={isTriggeringRun}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-black px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2"
              >
                {isTriggeringRun ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  <Play size={14} fill="black" />
                )}
                {isTriggeringRun ? 'Memproses...' : 'Picu Content Flow Baru'}
              </button>
            </div>

            <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-xs text-[#a1a1aa] flex items-center justify-center gap-2">
                  <RefreshCw className="animate-spin" size={16} />
                  Memuat data pipeline...
                </div>
              ) : runs.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#a1a1aa]">
                  Tidak ada alur kerja aktif saat ini. Silakan picu baru!
                </div>
              ) : (
                <div className="divide-y divide-[#27272a]">
                  {runs.map((run) => (
                    <div key={run.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-sm text-white">{run.project_title || 'Project Tanpa Judul'}</h3>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] bg-[#27272a] text-[#a1a1aa] px-2 py-0.5 rounded font-mono">
                            ID: {run.id.slice(0, 8)}
                          </span>
                          <span className="text-xs text-[#71717a]">
                            {new Date(run.created_at).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-[#09090b] px-3 py-1 rounded-lg border border-[#27272a]">
                          <Layers size={12} className="text-emerald-400" />
                          <span className="text-xs font-medium text-white capitalize">{run.current_step}</span>
                        </div>

                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          run.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                          run.status === 'running' ? 'bg-blue-500/10 text-blue-400' :
                          run.status === 'paused_for_approval' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {run.status === 'completed' && <CheckCircle size={12} />}
                          {run.status === 'running' && <RefreshCw className="animate-spin" size={12} />}
                          {run.status === 'paused_for_approval' && <Clock size={12} />}
                          {run.status === 'failed' && <AlertCircle size={12} />}
                          <span className="capitalize">{run.status.replace(/_/g, ' ')}</span>
                        </div>

                        {run.status === 'paused_for_approval' && (
                          <button
                            onClick={() => handleApprove(run.id)}
                            disabled={approvingRunId === run.id}
                            className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-black px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
                          >
                            {approvingRunId === run.id ? (
                              <Loader2 className="animate-spin" size={12} />
                            ) : null}
                            {approvingRunId === run.id ? 'Memproses...' : 'Approve Ide'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'niches' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Form Create/Edit Niche & Agents (Col: 5) */}
            <div className="xl:col-span-5 bg-[#18181b] border border-[#27272a] rounded-xl p-6 space-y-6 h-fit max-h-[85vh] overflow-y-auto">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Bookmark size={18} className="text-emerald-400" />
                  {newNiche.id ? 'Edit Niche Profile' : 'Buat Niche Profile Baru'}
                </h2>
                <p className="text-xs text-[#a1a1aa] mt-1">Konfigurasi branding, Custom LLM, dan sub-agent sekaligus</p>
              </div>

              <form onSubmit={handleSaveNiche} className="space-y-6">
                {/* BRANDING SECTION */}
                <div className="space-y-4 border-b border-[#27272a] pb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">1. Niche & Branding</h3>
                  <div>
                    <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Nama Niche</label>
                    <input
                      type="text"
                      required
                      value={newNiche.name}
                      onChange={(e) => setNewNiche({ ...newNiche, name: e.target.value })}
                      placeholder="Contoh: Tekno Tips, Crypto Indo"
                      className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Deskripsi Persona</label>
                    <textarea
                      rows={2}
                      value={newNiche.description}
                      onChange={(e) => setNewNiche({ ...newNiche, description: e.target.value })}
                      placeholder="Persona niche, target audiens, gaya bahasa..."
                      className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Watermark Logo URL</label>
                    <input
                      type="url"
                      value={newNiche.logo_url}
                      onChange={(e) => setNewNiche({ ...newNiche, logo_url: e.target.value })}
                      placeholder="https://drive.google.com/..."
                      className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Aspect Ratio</label>
                      <select
                        value={newNiche.aspect_ratio}
                        onChange={(e) => setNewNiche({ ...newNiche, aspect_ratio: e.target.value })}
                        className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="9:16">9:16 (Shorts/Reels)</option>
                        <option value="16:9">16:9 (Landscape)</option>
                        <option value="1:1">1:1 (Square)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Voice Provider</label>
                      <input
                        type="text"
                        value={newNiche.voice_provider}
                        onChange={(e) => setNewNiche({ ...newNiche, voice_provider: e.target.value })}
                        placeholder="edge / elevenlabs"
                        className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Speed</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newNiche.voice_speed}
                        onChange={(e) => setNewNiche({ ...newNiche, voice_speed: parseFloat(e.target.value) })}
                        className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Referensi Gambar (URLs)</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="Masukkan URL Gambar..."
                        className="flex-1 bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (imageUrlInput) {
                            setNewNiche({
                              ...newNiche,
                              reference_images: [...newNiche.reference_images, imageUrlInput]
                            });
                            setImageUrlInput('');
                          }
                        }}
                        className="bg-[#27272a] hover:bg-[#3f3f46] text-white px-3 py-2 rounded-lg text-xs"
                      >
                        Add
                      </button>
                    </div>
                    {newNiche.reference_images.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {newNiche.reference_images.map((img, i) => (
                          <div key={i} className="text-[10px] text-[#a1a1aa] bg-[#09090b] p-1.5 rounded flex items-center justify-between truncate">
                            <span className="truncate">{img}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setNewNiche({
                                  ...newNiche,
                                  reference_images: newNiche.reference_images.filter((_, idx) => idx !== i)
                                });
                              }}
                              className="text-red-400 hover:text-red-500 ml-2"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* CUSTOM LLM CONFIGURE */}
                <div className="space-y-4 border-b border-[#27272a] pb-4 bg-[#1e1e24]/40 p-3 rounded-lg">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Cpu size={14} />
                    2. Custom LLM Provider per Niche
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Provider Type</label>
                      <select
                        value={newNiche.custom_llm_provider}
                        onChange={(e) => setNewNiche({ ...newNiche, custom_llm_provider: e.target.value })}
                        className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="google">Google AI Studio</option>
                        <option value="openai">OpenAI Compatible</option>
                        <option value="openrouter">OpenRouter AI</option>
                        <option value="custom_router">Local Custom Router</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Model Name</label>
                      <input
                        type="text"
                        value={newNiche.custom_llm_model}
                        onChange={(e) => setNewNiche({ ...newNiche, custom_llm_model: e.target.value })}
                        placeholder="e.g. gemini-2.0-flash"
                        className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#a1a1aa] mb-1 flex items-center gap-1">
                      <Globe size={12} /> Custom Base URL
                    </label>
                    <input
                      type="url"
                      value={newNiche.custom_llm_base_url}
                      onChange={(e) => setNewNiche({ ...newNiche, custom_llm_base_url: e.target.value })}
                      placeholder="https://api.openai.com/v1 (kosongkan jika default)"
                      className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#a1a1aa] mb-1 flex items-center gap-1">
                      <Key size={12} /> API Token / OAuth Key
                    </label>
                    <input
                      type="password"
                      value={newNiche.custom_llm_api_key}
                      onChange={(e) => setNewNiche({ ...newNiche, custom_llm_api_key: e.target.value })}
                      placeholder="Bearer token / API key..."
                      className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* SUB-AGENTS SPECIFIC PROMPTS */}
                <div className="space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">3. Sub-Agents Custom Configs</h3>
                  
                  {/* Ideation Agent */}
                  <div className="p-3 bg-[#09090b] border border-[#27272a] rounded-lg space-y-3">
                    <div className="flex items-center gap-2 text-amber-400">
                      <Sparkles size={14} />
                      <h4 className="text-xs font-bold">Ideation Agent</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="block text-[10px] text-[#71717a]">Model Override</label>
                        <input
                          type="text"
                          value={newNiche.ideation_model}
                          onChange={(e) => setNewNiche({ ...newNiche, ideation_model: e.target.value })}
                          className="w-full bg-[#18181b] border border-[#27272a] rounded px-2 py-1 text-[11px] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#71717a]">Temp</label>
                        <input
                          type="number"
                          step="0.1"
                          value={newNiche.ideation_temp}
                          onChange={(e) => setNewNiche({ ...newNiche, ideation_temp: parseFloat(e.target.value) })}
                          className="w-full bg-[#18181b] border border-[#27272a] rounded px-2 py-1 text-[11px] text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#71717a] mb-1">System Prompt</label>
                      <textarea
                        rows={2}
                        value={newNiche.ideation_prompt}
                        onChange={(e) => setNewNiche({ ...newNiche, ideation_prompt: e.target.value })}
                        placeholder="Instruksi khusus ideation..."
                        className="w-full bg-[#18181b] border border-[#27272a] rounded px-2 py-1.5 text-[11px] text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Narrative Agent */}
                  <div className="p-3 bg-[#09090b] border border-[#27272a] rounded-lg space-y-3">
                    <div className="flex items-center gap-2 text-blue-400">
                      <FileText size={14} />
                      <h4 className="text-xs font-bold">Narrative (Voice Script) Agent</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="block text-[10px] text-[#71717a]">Model Override</label>
                        <input
                          type="text"
                          value={newNiche.narrative_model}
                          onChange={(e) => setNewNiche({ ...newNiche, narrative_model: e.target.value })}
                          className="w-full bg-[#18181b] border border-[#27272a] rounded px-2 py-1 text-[11px] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#71717a]">Temp</label>
                        <input
                          type="number"
                          step="0.1"
                          value={newNiche.narrative_temp}
                          onChange={(e) => setNewNiche({ ...newNiche, narrative_temp: parseFloat(e.target.value) })}
                          className="w-full bg-[#18181b] border border-[#27272a] rounded px-2 py-1 text-[11px] text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#71717a] mb-1">System Prompt</label>
                      <textarea
                        rows={2}
                        value={newNiche.narrative_prompt}
                        onChange={(e) => setNewNiche({ ...newNiche, narrative_prompt: e.target.value })}
                        placeholder="Instruksi khusus scriptwriter..."
                        className="w-full bg-[#18181b] border border-[#27272a] rounded px-2 py-1.5 text-[11px] text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Image Prompt Agent */}
                  <div className="p-3 bg-[#09090b] border border-[#27272a] rounded-lg space-y-3">
                    <div className="flex items-center gap-2 text-purple-400">
                      <ImageIcon size={14} />
                      <h4 className="text-xs font-bold">Image Prompt Agent</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="block text-[10px] text-[#71717a]">Model Override</label>
                        <input
                          type="text"
                          value={newNiche.image_prompt_model}
                          onChange={(e) => setNewNiche({ ...newNiche, image_prompt_model: e.target.value })}
                          className="w-full bg-[#18181b] border border-[#27272a] rounded px-2 py-1 text-[11px] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#71717a]">Temp</label>
                        <input
                          type="number"
                          step="0.1"
                          value={newNiche.image_prompt_temp}
                          onChange={(e) => setNewNiche({ ...newNiche, image_prompt_temp: parseFloat(e.target.value) })}
                          className="w-full bg-[#18181b] border border-[#27272a] rounded px-2 py-1 text-[11px] text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#71717a] mb-1">System Prompt</label>
                      <textarea
                        rows={2}
                        value={newNiche.image_prompt_prompt}
                        onChange={(e) => setNewNiche({ ...newNiche, image_prompt_prompt: e.target.value })}
                        placeholder="Instruksi khusus prompt generator..."
                        className="w-full bg-[#18181b] border border-[#27272a] rounded px-2 py-1.5 text-[11px] text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Caption Agent */}
                  <div className="p-3 bg-[#09090b] border border-[#27272a] rounded-lg space-y-3">
                    <div className="flex items-center gap-2 text-pink-400">
                      <Volume2 size={14} />
                      <h4 className="text-xs font-bold">Caption & Hashtag Agent</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="block text-[10px] text-[#71717a]">Model Override</label>
                        <input
                          type="text"
                          value={newNiche.caption_model}
                          onChange={(e) => setNewNiche({ ...newNiche, caption_model: e.target.value })}
                          className="w-full bg-[#18181b] border border-[#27272a] rounded px-2 py-1 text-[11px] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#71717a]">Temp</label>
                        <input
                          type="number"
                          step="0.1"
                          value={newNiche.caption_temp}
                          onChange={(e) => setNewNiche({ ...newNiche, caption_temp: parseFloat(e.target.value) })}
                          className="w-full bg-[#18181b] border border-[#27272a] rounded px-2 py-1 text-[11px] text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#71717a] mb-1">System Prompt</label>
                      <textarea
                        rows={2}
                        value={newNiche.caption_prompt}
                        onChange={(e) => setNewNiche({ ...newNiche, caption_prompt: e.target.value })}
                        placeholder="Instruksi khusus captionwriter..."
                        className="w-full bg-[#18181b] border border-[#27272a] rounded px-2 py-1.5 text-[11px] text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  {newNiche.id && (
                    <button
                      type="button"
                      disabled={isSubmittingNiche}
                      onClick={() => {
                        setNewNiche({
                          name: '',
                          description: '',
                          reference_images: [],
                          logo_url: '',
                          custom_llm_provider: 'google',
                          custom_llm_base_url: '',
                          custom_llm_api_key: '',
                          custom_llm_model: 'gemini-2.0-flash',
                          aspect_ratio: '9:16',
                          voice_provider: 'edge',
                          voice_speed: 1.0,
                          ideation_prompt: '',
                          ideation_model: 'gemini-2.0-flash',
                          ideation_temp: 0.7,
                          narrative_prompt: '',
                          narrative_model: 'gemini-2.0-flash',
                          narrative_temp: 0.7,
                          image_prompt_prompt: '',
                          image_prompt_model: 'gemini-2.0-flash',
                          image_prompt_temp: 0.7,
                          caption_prompt: '',
                          caption_model: 'gemini-2.0-flash',
                          caption_temp: 0.7
                        });
                        setSelectedNiche(null);
                      }}
                      className="flex-1 bg-[#27272a] hover:bg-[#3f3f46] text-white py-2.5 rounded-lg text-xs font-semibold transition"
                    >
                      Batal
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmittingNiche}
                    className="flex-[2] bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-black py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    {isSubmittingNiche ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Save size={14} />
                    )}
                    {isSubmittingNiche ? 'Menyimpan...' : newNiche.id ? 'Update Niche Profile' : 'Simpan Niche Profile'}
                  </button>
                </div>
              </form>
            </div>

            {/* List Niche Profiles & Sub-Agent summary (Col: 7) */}
            <div className="xl:col-span-7 space-y-4 overflow-y-auto max-h-[85vh] pr-2">
              <h3 className="text-lg font-bold text-white">Niche Profiles Terdaftar</h3>
              {loading ? (
                <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-8 text-center text-xs text-[#a1a1aa] flex items-center justify-center gap-2">
                  <RefreshCw className="animate-spin" size={16} /> Memuat data Niche...
                </div>
              ) : niches.length === 0 ? (
                <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-8 text-center text-xs text-[#a1a1aa]">
                  Belum ada profile Niche terdaftar. Silakan buat satu di form kiri!
                </div>
              ) : (
                <div className="space-y-4">
                  {niches.map((niche) => (
                    <div 
                      key={niche.id} 
                      className={`bg-[#18181b] border rounded-xl p-6 transition flex flex-col justify-between space-y-4 ${
                        selectedNiche?.id === niche.id ? 'border-emerald-500 shadow-md shadow-emerald-500/10' : 'border-[#27272a]'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-lg text-white flex items-center gap-2">
                              {niche.name}
                              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono uppercase">
                                {niche.custom_llm_provider}
                              </span>
                            </h4>
                            <p className="text-xs text-[#a1a1aa] mt-1.5">{niche.description || 'Tidak ada deskripsi persona'}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEditNiche(niche)}
                              disabled={deletingNicheId === niche.id || isSubmittingNiche}
                              className="text-xs bg-[#27272a] hover:bg-[#3f3f46] px-3 py-1.5 rounded-md text-white font-medium transition"
                            >
                              Edit / Buka Detail
                            </button>
                            <button
                              onClick={() => handleDeleteNiche(niche.id)}
                              disabled={deletingNicheId === niche.id}
                              className="text-[#a1a1aa] hover:text-red-400 p-1.5 transition disabled:opacity-50"
                            >
                              {deletingNicheId === niche.id ? (
                                <Loader2 className="animate-spin" size={16} />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* LLM & Media Details */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 p-3 bg-[#09090b] rounded-lg border border-[#27272a] text-xs">
                          <div>
                            <span className="block text-[10px] text-[#71717a]">Model LLM</span>
                            <span className="font-semibold text-white truncate block">{niche.custom_llm_model}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-[#71717a]">Aspect Ratio</span>
                            <span className="font-semibold text-white">{niche.aspect_ratio}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-[#71717a]">Voice Speaker</span>
                            <span className="font-semibold text-white capitalize">{niche.voice_provider}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-[#71717a]">Voice Speed</span>
                            <span className="font-semibold text-white">{niche.voice_speed}x</span>
                          </div>
                        </div>

                        {niche.custom_llm_base_url && (
                          <div className="mt-3 text-[10px] text-[#a1a1aa] truncate bg-[#09090b] px-3 py-1.5 rounded border border-[#27272a] font-mono">
                            🔗 Base URL: {niche.custom_llm_base_url}
                          </div>
                        )}

                        {/* Agents prompts preview */}
                        <div className="mt-6 space-y-3">
                          <h5 className="text-xs font-bold text-[#e4e4e7] border-b border-[#27272a] pb-1">Sub-Agent Prompt Configurations:</h5>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="p-2.5 bg-[#09090b]/50 rounded border border-[#27272a]">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-amber-400 flex items-center gap-1">
                                  <Sparkles size={12} /> Ideation
                                </span>
                                <span className="text-[10px] font-mono text-[#71717a]">t: {niche.ideation_temp}</span>
                              </div>
                              <p className="text-[#a1a1aa] line-clamp-2 text-[11px] italic">
                                {niche.ideation_prompt || 'Default global system prompt...'}
                              </p>
                            </div>

                            <div className="p-2.5 bg-[#09090b]/50 rounded border border-[#27272a]">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-blue-400 flex items-center gap-1">
                                  <FileText size={12} /> Narrative
                                </span>
                                <span className="text-[10px] font-mono text-[#71717a]">t: {niche.narrative_temp}</span>
                              </div>
                              <p className="text-[#a1a1aa] line-clamp-2 text-[11px] italic">
                                {niche.narrative_prompt || 'Default global system prompt...'}
                              </p>
                            </div>

                            <div className="p-2.5 bg-[#09090b]/50 rounded border border-[#27272a]">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-purple-400 flex items-center gap-1">
                                  <ImageIcon size={12} /> Image Prompt
                                </span>
                                <span className="text-[10px] font-mono text-[#71717a]">t: {niche.image_prompt_temp}</span>
                              </div>
                              <p className="text-[#a1a1aa] line-clamp-2 text-[11px] italic">
                                {niche.image_prompt_prompt || 'Default global system prompt...'}
                              </p>
                            </div>

                            <div className="p-2.5 bg-[#09090b]/50 rounded border border-[#27272a]">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-pink-400 flex items-center gap-1">
                                  <Volume2 size={12} /> Caption
                                </span>
                                <span className="text-[10px] font-mono text-[#71717a]">t: {niche.caption_temp}</span>
                              </div>
                              <p className="text-[#a1a1aa] line-clamp-2 text-[11px] italic">
                                {niche.caption_prompt || 'Default global system prompt...'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
