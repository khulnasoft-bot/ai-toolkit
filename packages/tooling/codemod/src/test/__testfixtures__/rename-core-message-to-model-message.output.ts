// @ts-nocheck
import type { ModelMessage } from 'ai';

// Type annotation in variable declaration
const _messages: ModelMessage[] = [];

// Type annotation in function parameter
function _processMessages(msgs: ModelMessage[]) {
  return msgs;
}

// Function return type
function _getMessages(): ModelMessage[] {
  return [];
}

// In interface
interface ChatState {
  messages: ModelMessage[];
  history: ModelMessage[];
}

// In type alias
type MessageStore = {
  items: ModelMessage[];
};

// Generic constraint
function _filterMessages<T extends ModelMessage>(msgs: T[]): T[] {
  return msgs;
}

// Type assertion
const _msg = {} as ModelMessage;
