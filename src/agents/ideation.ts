import { GeminiService } from '../services/gemini';

export interface IdeaOutput {
  title: string;
  hook: string;
  body: string;
}

export class IdeationAgent {
  private gemini: GeminiService;

  constructor() {
    this.gemini = new GeminiService();
  }

  async run(topic: string, count: number = 3): Promise<IdeaOutput[]> {
    const prompt = `
    Kamu adalah Ideation Agent untuk AI Content Factory. Tugasmu adalah membuat ${count} ide konten kreatif berdasarkan topik berikut: "${topic}".
    
    Format output harus berupa JSON Array dengan objek yang memiliki key:
    - "title": Judul konten yang menarik perhatian.
    - "hook": Kalimat pembuka 3 detik pertama yang sangat memikat untuk video pendek (Reels/TikTok/Shorts).
    - "body": Penjelasan singkat isi ide konten tersebut.

    Ketentuan:
    - Gunakan Bahasa Indonesia yang santai, kekinian, dan relate dengan audiens muda.
    - Jawab HANYA dengan JSON valid, tanpa markdown \`\`\`json atau teks tambahan apapun.
    `;

    return this.gemini.generateJson<IdeaOutput[]>(prompt, true);
  }
}
