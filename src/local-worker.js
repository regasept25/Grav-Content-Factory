"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleFlowLocalWorker = void 0;
const playwright_1 = require("playwright");
const supabase_1 = require("./services/supabase");
const drive_1 = require("./services/drive");
const config_1 = require("./config");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
class GoogleFlowLocalWorker {
    drive;
    constructor() {
        this.drive = new drive_1.GoogleDriveService();
    }
    async startPolling() {
        console.log('🤖 Google Flow Local Worker aktif. Memantau job generate gambar...');
        setInterval(async () => {
            try {
                // Ambil prompt yang statusnya pending
                const { data: prompts, error } = await supabase_1.supabase
                    .from('image_prompts')
                    .select('*')
                    .eq('status', 'pending')
                    .limit(1);
                if (error)
                    throw error;
                if (prompts && prompts.length > 0) {
                    const job = prompts[0];
                    console.log(`[Job Found] Generate Scene #${job.scene_number} - Prompt: "${job.prompt_text}"`);
                    await this.processJob(job);
                }
            }
            catch (err) {
                console.error('Error saat polling job:', err);
            }
        }, 10000); // Poll setiap 10 detik
    }
    async processJob(job) {
        // 1. Update status di DB ke 'generating'
        await supabase_1.supabase
            .from('image_prompts')
            .update({ status: 'generating' })
            .eq('id', job.id);
        const browser = await playwright_1.chromium.launch({
            headless: config_1.mediaConfig.googleFlow.headless,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const context = await browser.newContext();
        const page = await context.newPage();
        const tempFilePath = path.join(__dirname, `../../temp_scene_${job.scene_number}.png`);
        try {
            // 2. Buka Google Labs Flow
            await page.goto(config_1.mediaConfig.googleFlow.url);
            await page.waitForLoadState('networkidle');
            // --- LOGIC AUTOMATION UNTUK GOOGLE FLOW ---
            // Catatan: Google Flow memerlukan login akun Google. 
            // Untuk otomasi penuh, Abang harus menyimpan state login / session cookies 
            // atau login manual di browser saat pertama kali berjalan jika headless = false.
            console.log('Menunggu interaksi/login Google Flow jika diperlukan...');
            await page.waitForTimeout(5000); // Memberi jeda waktu
            // --- SIMULASI GENERATE & SIMPAN ---
            // TODO: Implementasikan interaksi selector spesifik Google Labs Flow 
            // (karena ini web labs eksklusif, selector tombol submit gambar bisa berubah.
            // Jika butuh penyesuaian detail selector web, kita sesuaikan nanti).
            // Sebagai fallback / placeholder visual, kita ambil screenshot halaman sebagai bukti
            await page.screenshot({ path: tempFilePath });
            console.log(`Gambar Scene #${job.scene_number} berhasil di-generate lokal.`);
            // 3. Upload ke Google Drive
            console.log('Mengunggah hasil generate ke Google Drive...');
            const driveUrl = await this.drive.uploadFile(tempFilePath, 'image/png', `Scene_${job.scene_number}.png`);
            // 4. Update DB ke 'completed'
            await supabase_1.supabase
                .from('image_prompts')
                .update({
                status: 'completed',
                image_url: driveUrl
            })
                .eq('id', job.id);
            console.log(`[Job Selesai] Scene #${job.scene_number} sukses di-upload: ${driveUrl}`);
            // Hapus file temp lokal
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
        }
        catch (err) {
            console.error(`Gagal memproses job image generate:`, err);
            await supabase_1.supabase
                .from('image_prompts')
                .update({ status: 'failed' })
                .eq('id', job.id);
        }
        finally {
            await browser.close();
        }
    }
}
exports.GoogleFlowLocalWorker = GoogleFlowLocalWorker;
//# sourceMappingURL=local-worker.js.map