export declare class WorkflowEngine {
    private supervisor;
    private ideation;
    private narrative;
    private imagePrompt;
    private caption;
    constructor();
    createNewProject(title: string): Promise<{
        projectId: any;
        workflowRunId: any;
    }>;
    private executeWorkflow;
}
//# sourceMappingURL=engine.d.ts.map