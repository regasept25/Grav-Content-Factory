"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagePromptAgent = void 0;
const gemini_1 = require("./gemini");
class ImagePromptAgent {
    gemini;
    constructor() {
        this.gemini = new gemini_1.GeminiService();
    }
    async run(scriptText, visualNotes, ratio = '9:16') {
        const prompt = `
    Kamu adalah Image Prompter Agent. Tugasmu adalah menganalisis naskah video dan catatan visual di bawah ini, lalu membaginya menjadi beberapa scene berurutan. Untuk tiap scene, buat prompt gambar yang mendetail untuk di-generate oleh AI Generator (Google Labs Flow / Imagen).
    
    Naskah: "${scriptText}"
    Catatan Visual: "${visualNotes}"
    Rasio yang diinginkan: "${ratio}"

    Format output harus berupa JSON Array dari objek dengan key:
    - "sceneNumber": Nomor scene berurutan (mulai dari 1).
    - "promptText": Prompt gambar yang detail dalam Bahasa Inggris untuk hasil maksimal. Sertakan gaya visual (misal: "cyberpunk style, photorealistic, 3d render, cinematic lighting, vivid colors").
    - "negativePrompt": Hal-hal yang tidak boleh ada di gambar (misal: "text, blurry, bad anatomy, deformed").
    - "aspectRatio": Rasio gambar (default: "${ratio}").

    Ketentuan:
    - Batasi jumlah scene berkisar antara 3 sampai 6 scene agar tidak terlalu banyak memakan kuota generate gambar.
    - Jawab HANYA dengan JSON valid, tanpa markdown \`\`\`json atau teks tambahan apapun.
    `;
        return this.gemini.generateJson(prompt, false);
    }
}
exports.ImagePromptAgent = ImagePromptAgent;
//# sourceMappingURL=image-prompt.js.map