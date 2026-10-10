import { ToolLoopAgent } from '@ai-toolkit/ai';
export declare const openaiWebSearchAgent: ToolLoopAgent<never, {
    web_search: import("@ai-toolkit/ai").Tool<{}, {
        action: {
            type: "search";
            query?: string;
        } | {
            type: "openPage";
            url?: string | null;
        } | {
            type: "findInPage";
            url?: string | null;
            pattern?: string | null;
        };
        sources?: Array<{
            type: "url";
            url: string;
        } | {
            type: "api";
            name: string;
        }>;
    }, any>;
}, never>;
