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
exports.telegramConfig = exports.mediaConfig = exports.aiConfig = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// Konfigurasi Sub-Agent AI Teks
exports.aiConfig = {
    // Provider Default: 'google' atau 'openai'
    provider: process.env.AI_PROVIDER || 'google',
    google: {
        apiKey: process.env.GOOGLE_AI_API_KEY || '',
        model: 'gemini-1.5-flash', // Model standar hemat token
        highReasoningModel: 'gemini-1.5-pro', // Untuk narrative/ideation kompleks
    },
    openai: {
        apiKey: process.env.OPENAI_API_KEY || '',
        model: 'gpt-4o-mini',
        highReasoningModel: 'gpt-4o',
    }
};
// Konfigurasi Sub-Agent Media
exports.mediaConfig = {
    // Google Labs Flow config (untuk automation script)
    googleFlow: {
        url: 'https://labs.google/fx/tools/flow',
        headless: false, // Diset false agar Abang bisa lihat browsernya jalan di server lokal
        executablePath: process.env.CHROME_PATH || undefined,
    },
    // Google Drive config
    googleDrive: {
        clientId: process.env.GOOGLE_DRIVE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET || '',
        redirectUri: process.env.GOOGLE_DRIVE_REDIRECT_URI || 'https://developers.google.com/oauthplayground',
        refreshToken: process.env.GOOGLE_DRIVE_REFRESH_TOKEN || '',
        folderId: process.env.GOOGLE_DRIVE_FOLDER_ID || '',
    }
};
// Konfigurasi Supervisor (Telegram)
exports.telegramConfig = {
    token: process.env.TELEGRAM_BOT_TOKEN || '',
    chatId: process.env.TELEGRAM_CHAT_ID || '',
};
//# sourceMappingURL=config.js.map