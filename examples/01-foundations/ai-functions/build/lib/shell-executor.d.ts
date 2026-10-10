export declare function executeShellCommand(command: string, timeoutMs?: number): Promise<{
    stdout: string;
    stderr: string;
    outcome: {
        type: 'timeout';
    } | {
        type: 'exit';
        exitCode: number;
    };
}>;
