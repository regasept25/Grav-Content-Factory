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
  Settings, 
  Sliders, 
  Bookmark, 
  Plus, 
  Trash2, 
  Save, 
  RefreshCw 
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
  llm_model: string;
  reasoning_model: string;
  aspect_ratio: string;
  voice_provider: string;
  voice_speed: number;
  system_instructions: string;
}

interface AgentConfig {
  id?: string;
  agent_name: string;
  llm_model: string;
  system_prompt: string;
  temperature: number;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'niches' | 'agents'>('dashboard');
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [niches, setNiches] = useState<Niche[]>([]);
  const [configs, setConfigs] = useState<AgentConfig[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states for Niche
  const [newNiche, setNewNiche] = useState<Niche>({
    name: '',
    description: '',
    reference_images: [],
    logo_url: '',
    llm_model: 'gemini-2.0-flash',
    reasoning_model: 'gemini-2.0-flash',
    aspect_ratio: '9:16',
    voice_provider: 'edge',
    voice_speed: 1.0,
    system_instructions: ''
  });
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Form states for Agent Configs
  const [agentConfigsMap, setAgentConfigsMap] = useState<Record<string, AgentConfig>>({
    ideation: { agent_name: 'ideation', llm_model: 'gemini-2.0-flash', system_prompt: '', temperature: 0.7 },
    narrative: { agent_name: 'narrative', llm_model: 'gemini-2.0-flash', system_prompt: '', temperature: 0.7 },
    image_prompt: { agent_name: 'image_prompt', llm_model: 'gemini-2.0-flash', system_prompt: '', temperature: 0.7 },
    caption: { agent_name: 'caption', llm_model: 'gemini-2.0-flash', system_prompt: '', temperature: 0.7 }
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [runsRes, nichesRes, configsRes] = await Promise.all([
        fetch('/api/runs'),
        fetch('/api/niches'),
        fetch('/api/configs')
      ]);

      const runsData = await runsRes.json();
      const nichesData = await nichesRes.json();
      const configsData = await configsRes.json();

      setRuns(Array.isArray(runsData) ? runsData : []);
      setNiches(Array.isArray(nichesData) ? nichesData : []);

      if (Array.isArray(configsData) && configsData.length > 0) {
        const map = { ...agentConfigsMap };
        configsData.forEach((c: AgentConfig) => {
          map[c.agent_name] = c;
        });
        setAgentConfigsMap(map);
      }
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

    try {
      const res = await fetch('/api/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      alert('Gagal memicu content flow');
    }
  };

  const handleApprove = async (runId: string) => {
    try {
      const res = await fetch(`/api/approve/${runId}`, { method: 'POST' });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      alert('Gagal menyetujui ide');
    }
  };

  const handleSaveNiche = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/niches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNiche)
      });
      if (res.ok) {
        setNewNiche({
          name: '',
          description: '',
          reference_images: [],
          logo_url: '',
          llm_model: 'gemini-2.0-flash',
          reasoning_model: 'gemini-2.0-flash',
          aspect_ratio: '9:16',
          voice_provider: 'edge',
          voice_speed: 1.0,
          system_instructions: ''
        });
        fetchData();
      } else {
        const err = await res.json();
        alert('Gagal menyimpan Niche: ' + err.error);
      }
    } catch (e) {
      alert('Error saving niche');
    }
  };

  const handleDeleteNiche = async (id?: string) => {
    if (!id || !confirm('Hapus Niche ini?')) return;
    try {
      const res = await fetch(`/api/niches/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      alert('Gagal menghapus niche');
    }
  };

  const handleSaveAgentConfig = async (agentName: string) => {
    try {
      const config = agentConfigsMap[agentName];
      const res = await fetch('/api/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        alert(`Konfigurasi Agent ${agentName} berhasil disimpan!`);
      }
    } catch (e) {
      alert('Gagal menyimpan konfigurasi');
    }
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
              <p className="text-[10px] text-emerald-400 font-mono">SUPERVISOR CONNECTED</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${activeTab === 'dashboard' ? 'bg-[#27272a] text-white' : 'text-[#a1a1aa] hover:text-white'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('niches')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${activeTab === 'niches' ? 'bg-[#27272a] text-white' : 'text-[#a1a1aa] hover:text-white'}`}
            >
              Niche Profiles
            </button>
            <button 
              onClick={() => setActiveTab('agents')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${activeTab === 'agents' ? 'bg-[#27272a] text-white' : 'text-[#a1a1aa] hover:text-white'}`}
            >
              Agent Configs
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Header section */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Antrean Alur Kerja Aktif</h2>
                <p className="text-xs text-[#a1a1aa] mt-1">Real-time update dari pipeline Content Factory</p>
              </div>
              <button 
                onClick={triggerNewRun}
                className="bg-emerald-500 hover:bg-emerald-600 text-black px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2"
              >
                <Play size={14} fill="black" />
                Picu Content Flow Baru
              </button>
            </div>

            {/* List Pipeline Runs */}
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
                            className="bg-amber-500 hover:bg-amber-600 text-black px-3 py-1.5 rounded-lg text-xs font-bold transition"
                          >
                            Approve Ide
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Create Niche */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 space-y-6 h-fit">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Bookmark size={18} className="text-emerald-400" />
                  Tambah Niche Baru
                </h2>
                <p className="text-xs text-[#a1a1aa] mt-1">Konfigurasi profile segment & branding</p>
              </div>

              <form onSubmit={handleSaveNiche} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Nama Niche</label>
                  <input
                    type="text"
                    required
                    value={newNiche.name}
                    onChange={(e) => setNewNiche({ ...newNiche, name: e.target.value })}
                    placeholder="Contoh: Tekno Tips, Masak Enak"
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Penjelasan / Deskripsi Niche</label>
                  <textarea
                    rows={3}
                    value={newNiche.description}
                    onChange={(e) => setNewNiche({ ...newNiche, description: e.target.value })}
                    placeholder="Tulis detail persona niche untuk memandu LLM..."
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Model LLM</label>
                    <select
                      value={newNiche.llm_model}
                      onChange={(e) => setNewNiche({ ...newNiche, llm_model: e.target.value })}
                      className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                      <option value="gemini-2.0-pro-exp">Gemini 2.0 Pro</option>
                      <option value="deepseek-v4-pro">DeepSeek V4 (Local)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Model Reasoning</label>
                    <select
                      value={newNiche.reasoning_model}
                      onChange={(e) => setNewNiche({ ...newNiche, reasoning_model: e.target.value })}
                      className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                      <option value="gemini-2.0-pro-exp">Gemini 2.0 Pro</option>
                      <option value="deepseek-v4-pro">DeepSeek V4 (Local)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Voice Provider</label>
                    <input
                      type="text"
                      value={newNiche.voice_provider}
                      onChange={(e) => setNewNiche({ ...newNiche, voice_provider: e.target.value })}
                      placeholder="e.g. edge, elevenlabs"
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

                <div>
                  <label className="block text-xs font-medium text-[#a1a1aa] mb-1">System Instructions (Niche Custom)</label>
                  <textarea
                    rows={4}
                    value={newNiche.system_instructions}
                    onChange={(e) => setNewNiche({ ...newNiche, system_instructions: e.target.value })}
                    placeholder="Instruksi tambahan yang wajib dipatuhi oleh model..."
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 animate-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-black py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <Plus size={14} />
                  Simpan Niche Profile
                </button>
              </form>
            </div>

            {/* List Niche Profiles */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-white">Niche Profiles Terdaftar</h3>
              {niches.length === 0 ? (
                <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-8 text-center text-xs text-[#a1a1aa]">
                  Belum ada profile Niche terdaftar. Silakan buat satu di form kiri!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {niches.map((niche) => (
                    <div key={niche.id} className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-base text-white">{niche.name}</h4>
                          <button
                            onClick={() => handleDeleteNiche(niche.id)}
                            className="text-[#a1a1aa] hover:text-red-400 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-[#a1a1aa] mt-2 line-clamp-3">{niche.description || 'Tidak ada deskripsi'}</p>

                        <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] text-[#71717a] font-mono">
                          <div>LLM: <span className="text-emerald-400">{niche.llm_model}</span></div>
                          <div>Ratio: <span className="text-white">{niche.aspect_ratio}</span></div>
                          <div>Voice: <span className="text-white">{niche.voice_provider} ({niche.voice_speed}x)</span></div>
                        </div>

                        {niche.logo_url && (
                          <div className="mt-3 text-[10px] text-[#a1a1aa] truncate bg-[#09090b] p-1.5 rounded">
                            🎨 Logo: <span className="underline">{niche.logo_url}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Konfigurasi Sub-Agent</h2>
              <p className="text-xs text-[#a1a1aa] mt-1">Ubah prompt instruksi & setelan LLM per sub-agent secara realtime</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(agentConfigsMap).map((agentName) => {
                const config = agentConfigsMap[agentName];
                return (
                  <div key={agentName} className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                      <div className="flex items-center gap-2.5">
                        {agentName === 'ideation' && <Sparkles className="text-amber-400" size={18} />}
                        {agentName === 'narrative' && <FileText className="text-blue-400" size={18} />}
                        {agentName === 'image_prompt' && <ImageIcon className="text-purple-400" size={18} />}
                        {agentName === 'caption' && <Volume2 className="text-pink-400" size={18} />}
                        <h3 className="font-bold text-sm text-white capitalize">{agentName.replace(/_/g, ' ')} Agent</h3>
                      </div>
                      <button
                        onClick={() => handleSaveAgentConfig(agentName)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-black px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Save size={12} />
                        Simpan
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Model LLM</label>
                        <select
                          value={config.llm_model}
                          onChange={(e) => {
                            const newMap = { ...agentConfigsMap };
                            newMap[agentName].llm_model = e.target.value;
                            setAgentConfigsMap(newMap);
                          }}
                          className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        >
                          <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                          <option value="gemini-2.0-pro-exp">Gemini 2.0 Pro</option>
                          <option value="deepseek-v4-pro">DeepSeek V4 (Local Router)</option>
                        </select>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-medium text-[#a1a1aa] mb-1">
                          <span>Temperature</span>
                          <span>{config.temperature}</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.1"
                          value={config.temperature}
                          onChange={(e) => {
                            const newMap = { ...agentConfigsMap };
                            newMap[agentName].temperature = parseFloat(e.target.value);
                            setAgentConfigsMap(newMap);
                          }}
                          className="w-full accent-emerald-500 bg-[#09090b]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#a1a1aa] mb-1">System Prompt / Role Instructions</label>
                        <textarea
                          rows={6}
                          value={config.system_prompt}
                          onChange={(e) => {
                            const newMap = { ...agentConfigsMap };
                            newMap[agentName].system_prompt = e.target.value;
                            setAgentConfigsMap(newMap);
                          }}
                          placeholder={`Masukkan prompt panduan custom untuk ${agentName} agent...`}
                          className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
