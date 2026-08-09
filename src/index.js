"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = require("./engine");
const local_worker_1 = require("./local-worker");
const mode = process.argv[2];
if (mode === 'worker') {
    const worker = new local_worker_1.GoogleFlowLocalWorker();
    worker.startPolling();
}
else {
    console.log('🤖 Menjalankan Server Utama / AI Content Factory Core...');
    const engine = new engine_1.WorkflowEngine();
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
//# sourceMappingURL=index.js.map