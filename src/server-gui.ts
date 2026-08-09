import express from 'express';
import { supabase } from './services/supabase';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Main HTML Dashboard
app.get('/', async (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Grav Content Factory CRM</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet">
      <style>
        :root {
          --color-bg-deep: #0f0f0f;
          --color-bg-canvas: #171717;
          --color-brand: #3ecf8e;
          --color-brand-hover: #00c573;
          --color-border: #2e2e2e;
          --color-border-hover: #363636;
          --color-text-primary: #fafafa;
          --color-text-secondary: #b4b4b4;
          --color-text-muted: #898989;
          --radius-card: 12px;
          --radius-pill: 9999px;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background-color: var(--color-bg-deep);
          color: var(--color-text-primary);
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          padding: 24px;
        }

        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 20px;
          margin-bottom: 30px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-logo {
          width: 32px;
          height: 32px;
          background: var(--color-brand);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: var(--color-bg-deep);
        }

        h1 {
          font-size: 24px;
          font-weight: 500;
          letter-spacing: -0.5px;
        }

        .btn-trigger {
          background: var(--color-brand);
          color: var(--color-bg-deep);
          border: none;
          padding: 10px 24px;
          border-radius: var(--radius-pill);
          font-weight: 500;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }

        .btn-trigger:hover {
          background: var(--color-brand-hover);
        }

        .grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }

        .card {
          background: var(--color-bg-canvas);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-card);
          padding: 24px;
          margin-bottom: 24px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .card-title {
          font-size: 18px;
          font-weight: 500;
        }

        .badge {
          font-size: 11px;
          font-family: 'Source Code Pro', monospace;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 4px 8px;
          border-radius: 4px;
          background: #242424;
          color: var(--color-text-secondary);
        }

        .badge.active {
          background: rgba(62, 207, 142, 0.1);
          color: var(--color-brand);
          border: 1px solid rgba(62, 207, 142, 0.2);
        }

        .run-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .run-item {
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.01);
          transition: border 0.2s;
        }

        .run-item:hover {
          border-color: var(--color-border-hover);
        }

        .run-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: var(--color-text-muted);
          margin-top: 12px;
        }

        .idea-box {
          margin-top: 12px;
          padding: 12px;
          border-left: 2px solid var(--color-brand);
          background: rgba(62, 207, 142, 0.02);
          border-radius: 0 6px 6px 0;
        }

        .idea-title {
          font-weight: 500;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .idea-desc {
          font-size: 13px;
          color: var(--color-text-secondary);
        }
      </style>
    </head>
    <body>
      <header>
        <div class="brand">
          <div class="brand-logo">G</div>
          <h1>Grav Content Factory CRM</h1>
        </div>
        <button class="btn-trigger" onclick="triggerWorkflow()">🚀 Picu Content Flow Baru</button>
      </header>

      <div class="grid">
        <div>
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Antrean Workflow Runs</h2>
              <span class="badge active" id="run-count">Loading...</span>
            </div>
            <div class="run-list" id="runs-container">
              <!-- Dynamically populated -->
            </div>
          </div>
        </div>

        <div>
          <div class="card">
            <h2 class="card-title" style="margin-bottom: 16px;">Quick Analytics</h2>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid var(--color-border);">
                <span style="color: var(--color-text-secondary)">Total Runs</span>
                <span id="stat-total" style="font-weight: bold;">-</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid var(--color-border);">
                <span style="color: var(--color-text-secondary)">Pending Approval</span>
                <span id="stat-pending" style="font-weight: bold; color: var(--color-brand);">-</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script>
        async function fetchRuns() {
          try {
            const res = await fetch('/api/runs');
            const data = await res.json();
            
            document.getElementById('run-count').innerText = data.length + ' Running';
            document.getElementById('stat-total').innerText = data.length;
            document.getElementById('stat-pending').innerText = data.filter(r => r.status === 'paused_for_approval').length;

            const container = document.getElementById('runs-container');
            container.innerHTML = '';

            if (data.length === 0) {
              container.innerHTML = '<div style=\"color: var(--color-text-muted); text-align: center; padding: 24px;\">Belum ada workflow run yang aktif.</div>';
              return;
            }

            data.forEach(run => {
              const item = document.createElement('div');
              item.className = 'run-item';
              
              let stepHtml = '';
              if (run.content_ideas && run.content_ideas.length > 0) {
                const selected = run.content_ideas.find(i => i.is_selected) || run.content_ideas[0];
                stepHtml = \`
                  <div class="idea-box">
                    <div class="idea-title">\${selected.title}</div>
                    <div class="idea-desc">Hook: "\${selected.hook}"</div>
                  </div>
                \`;
              }

              item.innerHTML = \`
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <strong style="font-size: 15px;">Run ID: \${run.id.substring(0, 8)}...</strong>
                  <span class="badge" style="background: \${run.status === 'paused_for_approval' ? 'rgba(235, 179, 57, 0.1)' : 'rgba(62, 207, 142, 0.1)'}; color: \${run.status === 'paused_for_approval' ? '#ebb339' : '#3ecf8e'}; border: 1px solid \${run.status === 'paused_for_approval' ? 'rgba(235,179,57,0.2)' : 'rgba(62,207,142,0.2)'};">\${run.status}</span>
                </div>
                <div style="font-size: 13px; color: var(--color-text-secondary); margin-top: 8px;">
                  Langkah saat ini: <code style="font-family: 'Source Code Pro', monospace; color: var(--color-brand)">\${run.current_step}</code>
                </div>
                \${stepHtml}
                <div class="run-meta">
                  <span>Dibuat: \${new Date(run.created_at).toLocaleString()}</span>
                  \${run.status === 'paused_for_approval' ? \`<button onclick="approveRun('\${run.id}')" style="background: var(--color-brand); color: var(--color-bg-deep); border: none; padding: 4px 12px; border-radius: 4px; font-weight: 500; cursor: pointer; font-size: 11px;">Approve Ide</button>\` : ''}
                </div>
              \`;
              container.appendChild(item);
            });

          } catch (err) {
            console.error('Error fetching runs:', err);
          }
        }

        async function triggerWorkflow() {
          try {
            const res = await fetch('/api/trigger', { method: 'POST' });
            const data = await res.json();
            alert('Workflow berhasil ditambahkan dengan Run ID: ' + data.runId);
            fetchRuns();
          } catch (err) {
            alert('Gagal memicu workflow.');
          }
        }

        async function approveRun(runId) {
          try {
            await fetch(\`/api/approve/\${runId}\`, { method: 'POST' });
            alert('Workflow disetujui!');
            fetchRuns();
          } catch (err) {
            alert('Gagal menyetujui.');
          }
        }

        // Poll every 3 seconds
        fetchRuns();
        setInterval(fetchRuns, 3000);
      </script>
    </body>
    </html>
  `);
});

// API endpoint to fetch runs from Supabase
app.get('/api/runs', async (req, res) => {
  try {
    const { data: runs, error } = await supabase
      .from('workflow_runs')
      .select('*, content_ideas(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(runs || []);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// API endpoint to trigger a new run
app.post('/api/trigger', async (req, res) => {
  try {
    // 1. Create project if not exists
    let projectId = '99999999-9999-9999-9999-999999999999'; // dummy project
    const { data: proj } = await supabase.from('projects').select('id').limit(1).single();
    if (proj) {
      projectId = proj.id;
    } else {
      const { data: newProj } = await supabase.from('projects').insert({ title: 'Default Content Project' }).select('id').single();
      if (newProj) projectId = newProj.id;
    }

    // 2. Insert new workflow run
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
    res.json({ success: true, runId: run.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// API endpoint to approve run manually via UI
app.post('/api/approve/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('workflow_runs')
      .update({ status: 'running', current_step: 'narrative' })
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[GUI Dashboard] Running on http://localhost:${PORT}`);
});
