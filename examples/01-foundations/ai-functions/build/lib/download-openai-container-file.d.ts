import 'dotenv/config';
export declare function downloadOpenaiContainerFile(container: string, file: string): Promise<{
    path: string;
    size: number;
}>;
