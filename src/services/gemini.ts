import { GoogleGenerativeAI } from '@google/generative-ai';
import { aiConfig } from '../config';

export class GeminiService {
  private ai: any;

  constructor() {
    if (aiConfig.google.apiKey) {
      this.ai = new GoogleGenerativeAI(aiConfig.google.apiKey);
    }
  }

  async generateText(prompt: string, highReasoning = false): Promise<string> {
    if (!this.ai) {
      throw new Error('Google AI Studio API Key is not configured.');
    }
    const modelName = highReasoning 
      ? aiConfig.google.highReasoningModel 
      : aiConfig.google.model;
      
    const model = this.ai.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  async generateJson<T>(prompt: string, highReasoning = false): Promise<T> {
    if (!this.ai) {
      throw new Error('Google AI Studio API Key is not configured.');
    }
    const modelName = highReasoning 
      ? aiConfig.google.highReasoningModel 
      : aiConfig.google.model;

    const model = this.ai.getGenerativeModel({ 
      model: modelName,
      generationConfig: { responseMimeType: 'application/json' }
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text) as T;
  }
}
