"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NarrativeAgent = void 0;
const gemini_1 = require("./gemini");
class NarrativeAgent {
    gemini;
    constructor() {
        this.gemini = new gemini_1.GeminiService();
    }
    async run(title, hook, body) {
        const prompt = `
    Kamu adalah Narrator Agent untuk AI Content Factory. Tugasmu membuat naskah narasi video pendek berdurasi maksimal 60 detik (sekitar 120-150 kata) berdasarkan ide konten ini:
    Judul: "${title}"
    Hook: "${hook}"
    Isi Ide: "${body}"

    Format output harus berupa JSON dengan key:
    - "scriptText": Naskah narasi lengkap yang siap dibacakan oleh voice-over. Masukkan hook di bagian awal secara mulus. Gunakan tanda baca yang pas agar intonasi pembacaan natural.
    - "visualNotes": Panduan visual detail untuk video editor (misal: "tunjukkan mockup HP", "transisi cepat dengan zoom-in", "tampilkan teks dengan font bold").

    Ketentuan:
    - Gunakan Bahasa Indonesia yang persuasif, gaul, dan penuh energi (vibe-coding style).
    - Jawab HANYA dengan JSON valid, tanpa markdown \`\`\`json atau teks tambahan apapun.
    `;
        return this.gemini.generateJson(prompt, true);
    }
}
exports.NarrativeAgent = NarrativeAgent;
//# sourceMappingURL=narrative.js.map