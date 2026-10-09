// @ts-nocheck
import type { CoreAssistantMessage, CoreMessage, CoreToolMessage, CoreUserMessage } from 'ai';

function _processMessage(message: CoreMessage) {
  console.log(message);
}

function _handleUser(msg: CoreUserMessage) {
  console.log(msg);
}

const _assistant: CoreAssistantMessage = {
  role: 'assistant',
  content: 'Hello',
};

type ToolHandler = (msg: CoreToolMessage) => void;
