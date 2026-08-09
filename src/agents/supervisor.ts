import TelegramBot from 'node-telegram-bot-api';
import { telegramConfig } from '../config';

export class TelegramSupervisorAgent {
  private bot: TelegramBot | null = null;
  private chatId: string;
  private pendingApprovals: Map<string, (approved: boolean, selectedIndex?: number) => void> = new Map();

  constructor() {
    this.chatId = telegramConfig.chatId;
    if (telegramConfig.token && this.chatId) {
      this.bot = new TelegramBot(telegramConfig.token, { polling: true });
      this.setupListeners();
    }
  }

  private setupListeners() {
    if (!this.bot) return;

      this.bot.on('callback_query', (query: any) => {
        const data = query.data || '';
        const messageId = query.message?.message_id;

        if (data.startsWith('approve_') || data.startsWith('reject_')) {
          const [action, workflowId] = data.split('_');
          const resolve = this.pendingApprovals.get(workflowId);

          if (resolve) {
            const approved = action === 'approve';
            resolve(approved);
            this.pendingApprovals.delete(workflowId);

            this.bot?.answerCallbackQuery(query.id, { text: approved ? 'Disetujui!' : 'Ditolak!' });
            this.bot?.editMessageText(
              `Status: ${approved ? '✅ Disetujui' : '❌ Ditolak'} oleh Bang Rega.`,
              { chat_id: this.chatId, message_id: messageId }
            );
          }
        }

        if (data.startsWith('selectidea_')) {
          const [, workflowId, indexStr] = data.split('_');
          const resolve = this.pendingApprovals.get(workflowId);
          const index = parseInt(indexStr);

          if (resolve) {
            resolve(true, index);
            this.pendingApprovals.delete(workflowId);

            this.bot?.answerCallbackQuery(query.id, { text: `Ide #${index + 1} terpilih!` });
            this.bot?.editMessageText(
              `Status: Ide #${index + 1} dipilih oleh Bang Rega.`,
              { chat_id: this.chatId, message_id: messageId }
            );
          }
        }
      });
  }

  async sendReport(message: string) {
    if (!this.bot) {
      console.log(`[Telegram Mock Report]: ${message}`);
      return;
    }
    await this.bot.sendMessage(this.chatId, message, { parse_mode: 'Markdown' });
  }

  async requestIdeaSelection(workflowId: string, ideas: { title: string; hook: string; body: string }[]): Promise<number> {
    if (!this.bot) {
      console.log('[Telegram Mock Request]: Memilih ide pertama otomatis (Mock Mode)');
      return 0;
    }

    let text = `*🚨 PILIH IDE KONTEN BARU DARI MULTI-AGENT*\n\n`;
    const keyboardButtons = [];

    for (let i = 0; i < ideas.length; i++) {
      const idea = ideas[i];
      if (idea) {
        text += `*Ide #${i + 1}: ${idea.title}*\n`;
        text += `🪝 Hook: "${idea.hook}"\n`;
        text += `📝 Deskripsi: ${idea.body}\n\n`;

        keyboardButtons.push({
          text: `Pilih Ide #${i + 1}`,
          callback_data: `selectidea_${workflowId}_${i}`
        });
      }
    }

    await this.bot.sendMessage(this.chatId, text, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [keyboardButtons]
      }
    });

    return new Promise<number>((resolve) => {
      this.pendingApprovals.set(workflowId, (approved, selectedIndex) => {
        resolve(selectedIndex !== undefined ? selectedIndex : 0);
      });
    });
  }

  async requestApproval(workflowId: string, message: string): Promise<boolean> {
    if (!this.bot) {
      console.log('[Telegram Mock Request]: Menyetujui otomatis (Mock Mode)');
      return true;
    }

    await this.bot.sendMessage(this.chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Setujui', callback_data: `approve_${workflowId}` },
            { text: '❌ Tolak', callback_data: `reject_${workflowId}` }
          ]
        ]
      }
    });

    return new Promise<boolean>((resolve) => {
      this.pendingApprovals.set(workflowId, (approved) => {
        resolve(approved);
      });
    });
  }
}
