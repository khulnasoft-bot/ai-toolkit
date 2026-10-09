import { AITOOLKITError } from '@ai-toolkit/provider';

const name = 'AI_ToolCallNotFoundForApprovalError';
const marker = `vercel.ai.error.${name}`;
const _symbol = Symbol.for(marker);

export class ToolCallNotFoundForApprovalError extends AITOOLKITError {
  readonly toolCallId: string;
  readonly approvalId: string;

  constructor({
    toolCallId,
    approvalId,
  }: {
    toolCallId: string;
    approvalId: string;
  }) {
    super({
      name,
      message: `Tool call "${toolCallId}" not found for approval request "${approvalId}".`,
    });

    this.toolCallId = toolCallId;
    this.approvalId = approvalId;
  }

  static isInstance(error: unknown): error is ToolCallNotFoundForApprovalError {
    return AITOOLKITError.hasMarker(error, marker);
  }
}
