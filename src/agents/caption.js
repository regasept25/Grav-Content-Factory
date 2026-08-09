"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptionAgent = void 0;
const gemini_1 = require("./gemini");
class CaptionAgent {
    gemini;
    constructor() {
        this.gemini = new gemini_1.GeminiService();
    }
    async run(title, scriptText) {
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
        return this.gemini.generateJson(prompt, false);
    }
}
exports.CaptionAgent = CaptionAgent;
//# sourceMappingURL=caption.js.map