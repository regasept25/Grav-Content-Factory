import { WorkflowEngine } from './engine';
import { GoogleFlowLocalWorker } from './local-worker';

const mode = process.argv[2];

if (mode === 'worker') {
  const worker = new GoogleFlowLocalWorker();
  worker.startPolling();
} else {
  console.log('🤖 Menjalankan Server Utama / AI Content Factory Core...');
  const engine = new WorkflowEngine();

  // Contoh inisiasi project test (Bisa di-trigger dari route API Next.js nanti)
  const topic = 'Pentingnya Belajar Coding untuk Pemula di Tahun 2026';
  engine.createNewProject(topic)
    .then(({ projectId, workflowRunId }) => {
      console.log(`[Engine Started] Project ID: ${projectId} | Run ID: ${workflowRunId}`);
    })
    .catch((err) => {
      console.error('Engine error:', err);
    });
}
