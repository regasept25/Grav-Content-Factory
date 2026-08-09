"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdeationAgent = void 0;
const gemini_1 = require("../services/gemini");
class IdeationAgent {
    gemini;
    constructor() {
        this.gemini = new gemini_1.GeminiService();
    }
    async run(topic, count = 3) {
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
        return this.gemini.generateJson(prompt, true);
    }
}
exports.IdeationAgent = IdeationAgent;
