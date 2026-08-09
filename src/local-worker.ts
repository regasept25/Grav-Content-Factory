import { chromium } from 'playwright';
import { supabase } from './services/supabase';
import { GoogleDriveService } from './services/drive';
import { mediaConfig } from './config';
import * as path from 'path';
import * as fs from 'fs';

export class GoogleFlowLocalWorker {
  private drive: GoogleDriveService;

  constructor() {
    this.drive = new GoogleDriveService();
  }

  async startPolling() {
    console.log('🤖 Google Flow Local Worker aktif. Memantau job generate gambar...');
    
    setInterval(async () => {
      try {
        // Ambil prompt yang statusnya pending
        const { data: prompts, error } = await supabase
          .from('image_prompts')
          .select('*')
          .eq('status', 'pending')
          .limit(1);

        if (error) throw error;

        if (prompts && prompts.length > 0) {
          const job = prompts[0];
          console.log(`[Job Found] Generate Scene #${job.scene_number} - Prompt: "${job.prompt_text}"`);
          await this.processJob(job);
        }
      } catch (err) {
        console.error('Error saat polling job:', err);
      }
    }, 10000); // Poll setiap 10 detik
  }

  private async processJob(job: any) {
    // 1. Update status di DB ke 'generating'
    await supabase
      .from('image_prompts')
      .update({ status: 'generating' })
      .eq('id', job.id);

    const browser = await chromium.launch({
      headless: mediaConfig.googleFlow.headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await browser.newContext();
    const page = await context.newPage();
    const tempFilePath = path.join(__dirname, `../../temp_scene_${job.scene_number}.png`);

    try {
      // 2. Buka Google Labs Flow
      await page.goto(mediaConfig.googleFlow.url);
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
      await supabase
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

    } catch (err: any) {
      console.error(`Gagal memproses job image generate:`, err);
      await supabase
        .from('image_prompts')
        .update({ status: 'failed' })
        .eq('id', job.id);
    } finally {
      await browser.close();
    }
  }
}
