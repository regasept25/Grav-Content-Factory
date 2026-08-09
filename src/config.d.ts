export declare const aiConfig: {
    provider: string;
    google: {
        apiKey: string;
        model: string;
        highReasoningModel: string;
    };
    openai: {
        apiKey: string;
        model: string;
        highReasoningModel: string;
    };
};
export declare const mediaConfig: {
    googleFlow: {
        url: string;
        headless: boolean;
        executablePath: string | undefined;
    };
    googleDrive: {
        clientId: string;
        clientSecret: string;
        redirectUri: string;
        refreshToken: string;
        folderId: string;
    };
};
export declare const telegramConfig: {
    token: string;
    chatId: string;
};
//# sourceMappingURL=config.d.ts.map