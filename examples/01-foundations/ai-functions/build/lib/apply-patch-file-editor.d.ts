export type ApplyPatchOperation =
  | {
      type: 'create_file';
      path: string;
      diff: string;
    }
  | {
      type: 'delete_file';
      path: string;
    }
  | {
      type: 'update_file';
      path: string;
      diff: string;
    };
export declare function createApplyPatchExecutor(workspaceRoot: string): ({
  callId,
  operation,
}: {
  callId: string;
  operation: ApplyPatchOperation;
}) => Promise<{
  status: 'completed' | 'failed';
  output?: string;
}>;
export declare class WorkspaceEditor {
  private readonly root;
  constructor(root: string);
  createFile(
    operation: Extract<
      ApplyPatchOperation,
      {
        type: 'create_file';
      }
    >,
  ): Promise<{
    status: 'completed' | 'failed';
    output?: string;
  }>;
  updateFile(
    operation: Extract<
      ApplyPatchOperation,
      {
        type: 'update_file';
      }
    >,
  ): Promise<{
    status: 'completed' | 'failed';
    output?: string;
  }>;
  deleteFile(
    operation: Extract<
      ApplyPatchOperation,
      {
        type: 'delete_file';
      }
    >,
  ): Promise<{
    status: 'completed' | 'failed';
    output?: string;
  }>;
  private resolve;
}
