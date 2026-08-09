export declare class TelegramSupervisorAgent {
    private bot;
    private chatId;
    private pendingApprovals;
    constructor();
    private setupListeners;
    sendReport(message: string): Promise<void>;
    requestIdeaSelection(workflowId: string, ideas: {
        title: string;
        hook: string;
        body: string;
    }[]): Promise<number>;
    requestApproval(workflowId: string, message: string): Promise<boolean>;
}
//# sourceMappingURL=supervisor.d.ts.map