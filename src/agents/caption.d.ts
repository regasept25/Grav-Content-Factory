export interface CaptionOutput {
    captionText: string;
    hashtags: string;
}
export declare class CaptionAgent {
    private gemini;
    constructor();
    run(title: string, scriptText: string): Promise<CaptionOutput>;
}
//# sourceMappingURL=caption.d.ts.map