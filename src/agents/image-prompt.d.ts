export interface ImagePrompt {
    sceneNumber: number;
    promptText: string;
    negativePrompt: string;
    aspectRatio: string;
}
export declare class ImagePromptAgent {
    private gemini;
    constructor();
    run(scriptText: string, visualNotes: string, ratio?: string): Promise<ImagePrompt[]>;
}
//# sourceMappingURL=image-prompt.d.ts.map