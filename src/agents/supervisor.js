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
exports.TelegramSupervisorAgent = void 0;
const TelegramBot = __importStar(require("node-telegram-bot-api"));
const config_1 = require("../config");
class TelegramSupervisorAgent {
    bot = null;
    chatId;
    pendingApprovals = new Map();
    constructor() {
        this.chatId = config_1.telegramConfig.chatId;
        if (config_1.telegramConfig.token && this.chatId) {
            this.bot = new TelegramBot(config_1.telegramConfig.token, { polling: true });
            this.setupListeners();
        }
    }
    setupListeners() {
        if (!this.bot)
            return;
        this.bot.on('callback_query', (query) => {
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
                    this.bot?.editMessageText(`Status: ${approved ? '✅ Disetujui' : '❌ Ditolak'} oleh Bang Rega.`, { chat_id: this.chatId, message_id: messageId });
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
                    this.bot?.editMessageText(`Status: Ide #${index + 1} dipilih oleh Bang Rega.`, { chat_id: this.chatId, message_id: messageId });
                }
            }
        });
    }
    async sendReport(message) {
        if (!this.bot) {
            console.log(`[Telegram Mock Report]: ${message}`);
            return;
        }
        await this.bot.sendMessage(this.chatId, message, { parse_mode: 'Markdown' });
    }
    async requestIdeaSelection(workflowId, ideas) {
        if (!this.bot) {
            console.log('[Telegram Mock Request]: Memilih ide pertama otomatis (Mock Mode)');
            return 0;
        }
        let text = `*🚨 PILIH IDE KONTEN BARU DARI MULTI-AGENT*\n\n`;
        const keyboardButtons = [];
        for (let i = 0; i < ideas.length; i++) {
            const idea = ideas[i];
            text += `*Ide #${i + 1}: ${idea.title}*\n`;
            text += `🪝 Hook: "${idea.hook}"\n`;
            text += `📝 Deskripsi: ${idea.body}\n\n`;
            keyboardButtons.push({
                text: `Pilih Ide #${i + 1}`,
                callback_data: `selectidea_${workflowId}_${i}`
            });
        }
        await this.bot.sendMessage(this.chatId, text, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [keyboardButtons]
            }
        });
        return new Promise((resolve) => {
            this.pendingApprovals.set(workflowId, (approved, selectedIndex) => {
                resolve(selectedIndex !== undefined ? selectedIndex : 0);
            });
        });
    }
    async requestApproval(workflowId, message) {
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
        return new Promise((resolve) => {
            this.pendingApprovals.set(workflowId, (approved) => {
                resolve(approved);
            });
        });
    }
}
exports.TelegramSupervisorAgent = TelegramSupervisorAgent;
//# sourceMappingURL=supervisor.js.map