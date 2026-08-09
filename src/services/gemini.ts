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
    try {
      if (!this.ai) throw new Error('Google AI Studio API Key is not configured.');
      const modelName = highReasoning 
        ? aiConfig.google.highReasoningModel 
        : aiConfig.google.model;
        
      const model = this.ai.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (e: any) {
      console.log('Gemini failed, falling back to Local Router DeepSeek...', e.message);
      return this.fallbackGenerate(prompt, false);
    }
  }

  async generateJson<T>(prompt: string, highReasoning = false): Promise<T> {
    try {
      if (!this.ai) throw new Error('Google AI Studio API Key is not configured.');
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
    } catch (e: any) {
      console.log('Gemini JSON failed, falling back to Local Router DeepSeek...', e.message);
      const rawText = await this.fallbackGenerate(prompt, true);
      let cleanText = rawText.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.substring(7);
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.substring(3);
      }
      if (cleanText.endsWith('```')) {
        cleanText = cleanText.substring(0, cleanText.length - 3);
      }
      return JSON.parse(cleanText.trim()) as T;
    }
  }

  private async fallbackGenerate(prompt: string, expectJson: boolean): Promise<string> {
    const apiKey = process.env.HERMES_CUSTOM_LOCALHOST_20128_API_KEY || 'sk-1ea32a39281a02102128ae3901b02103f9011ea32a39281a02102128ae3901b02103f901a9c34';
    const res = await fetch('http://localhost:20128/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'Rega9RouterHermes',
        messages: [{ role: 'user', content: prompt }],
        stream: false,
        response_format: expectJson ? { type: 'json_object' } : undefined
      })
    });
    const data = await res.json();
    if (!data.choices || data.choices.length === 0) {
      throw new Error('Fallback API response invalid: ' + JSON.stringify(data));
    }
    return data.choices[0].message.content;
  }
}
