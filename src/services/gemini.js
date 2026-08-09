"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const config_1 = require("./config");
class GeminiService {
    ai;
    constructor() {
        if (config_1.aiConfig.google.apiKey) {
            // Library @google/generative-ai membutuhkan apiKey
            this.ai = new generative_ai_1.GoogleGenAI({ apiKey: config_1.aiConfig.google.apiKey });
        }
    }
    async generateText(prompt, highReasoning = false) {
        if (!this.ai) {
            throw new Error('Google AI Studio API Key is not configured.');
        }
        const modelName = highReasoning
            ? config_1.aiConfig.google.highReasoningModel
            : config_1.aiConfig.google.model;
        const model = this.ai.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    }
    async generateJson(prompt, highReasoning = false) {
        if (!this.ai) {
            throw new Error('Google AI Studio API Key is not configured.');
        }
        const modelName = highReasoning
            ? config_1.aiConfig.google.highReasoningModel
            : config_1.aiConfig.google.model;
        const model = this.ai.getGenerativeModel({
            model: modelName,
            generationConfig: { responseMimeType: 'application/json' }
        });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return JSON.parse(text);
    }
}
exports.GeminiService = GeminiService;
//# sourceMappingURL=gemini.js.map