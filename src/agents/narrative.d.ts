export interface NarrativeOutput {
    scriptText: string;
    visualNotes: string;
}
export declare class NarrativeAgent {
    private gemini;
    constructor();
    run(title: string, hook: string, body: string): Promise<NarrativeOutput>;
}
//# sourceMappingURL=narrative.d.ts.map