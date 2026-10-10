import type { StreamTextResult } from '@ai-toolkit/ai';
export declare function saveRawChunks({ result, filename, }: {
    result: StreamTextResult<any, any>;
    filename: string;
}): Promise<void>;
