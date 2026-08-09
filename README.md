# AI Agent Content Factory

Project backend hybrid untuk mengotomatisasi pembuatan konten secara bertahap menggunakan multi-agent:
1. **Ideation Agent** - Generate ide konten.
2. **Narrator Agent** - Membuat naskah / narasi video pendek.
3. **Image Prompter Agent** - Membuat detail prompt gambar dari narasi.
4. **Google Flow Worker** (Local) - Generate gambar menggunakan Google Labs Flow (Nano Banana 2) secara otomatis lewat browser headless lokal.
5. **Voice Over Agent** - Generate audio dari narasi.
6. **Caption Agent** - Membuat caption & hashtag sosmed.
7. **Telegram Supervisor Agent** - Memonitor seluruh alur, mengirim laporan progres, dan meminta konfirmasi persetujuan dari Bang Rega.

## Setup Env

Buat file `.env` di root project:

```env
# Database
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_KEY=your-supabase-service-role-key

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-chat-id-with-bot

# AI Provider Credentials
GOOGLE_AI_API_KEY=your-google-ai-studio-api-key
OPENAI_API_KEY=your-openai-api-key # Opsional jika ingin gonta-ganti

# Google Drive (Storage)
GOOGLE_DRIVE_CLIENT_ID=your-drive-client-id
GOOGLE_DRIVE_CLIENT_SECRET=your-drive-client-secret
GOOGLE_DRIVE_REDIRECT_URI=https://developers.google.com/oauthplayground
GOOGLE_DRIVE_REFRESH_TOKEN=your-drive-refresh-token
GOOGLE_DRIVE_FOLDER_ID=your-drive-folder-id # Opsional untuk mengelompokkan
```
