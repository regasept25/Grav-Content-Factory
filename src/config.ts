import * as dotenv from 'dotenv';
dotenv.config();

// Konfigurasi Sub-Agent AI Teks
export const aiConfig = {
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
export const mediaConfig = {
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
export const telegramConfig = {
  token: process.env.TELEGRAM_BOT_TOKEN || '',
  chatId: process.env.TELEGRAM_CHAT_ID || '',
};
