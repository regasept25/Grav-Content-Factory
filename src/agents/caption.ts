import { GeminiService } from '../services/gemini';

export interface CaptionOutput {
  captionText: string;
  hashtags: string;
}

export class CaptionAgent {
  private gemini: GeminiService;

  constructor() {
    this.gemini = new GeminiService();
  }

  async run(title: string, scriptText: string): Promise<CaptionOutput> {
    const prompt = `
    Kamu adalah Caption Agent untuk AI Content Factory. Tugasmu adalah membuat caption media sosial (Instagram/TikTok/Shorts) yang menarik berdasarkan narasi konten ini:
    Judul: "${title}"
    Naskah: "${scriptText}"

    Format output harus berupa JSON dengan key:
    - "captionText": Teks caption yang interaktif, mengundang diskusi/komentar, menggunakan emoji yang pas, dan memiliki Call to Action (CTA) di akhir.
    - "hashtags": Kumpulan hashtag populer dan relevan yang dipisahkan oleh spasi (minimal 5, maksimal 10 hashtag).

    Ketentuan:
    - Gunakan gaya bahasa anak muda Indonesia, santai, dan profesional.
    - Jawab HANYA dengan JSON valid, tanpa markdown \`\`\`json atau teks tambahan apapun.
    `;

    return this.gemini.generateJson<CaptionOutput>(prompt, false);
  }
}
