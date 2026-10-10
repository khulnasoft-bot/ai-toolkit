import 'dotenv/config';
export declare function downloadAzureContainerFile(container: string, file: string): Promise<{
    path: string;
    size: number;
}>;
