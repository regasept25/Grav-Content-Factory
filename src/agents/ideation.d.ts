export interface IdeaOutput {
    title: string;
    hook: string;
    body: string;
}
export declare class IdeationAgent {
    private gemini;
    constructor();
    run(topic: string, count?: number): Promise<IdeaOutput[]>;
}
//# sourceMappingURL=ideation.d.ts.map