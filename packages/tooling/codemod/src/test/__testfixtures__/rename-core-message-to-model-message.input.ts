// @ts-nocheck
import type { CoreMessage } from 'ai';

// Type annotation in variable declaration
const _messages: CoreMessage[] = [];

// Type annotation in function parameter
function _processMessages(msgs: CoreMessage[]) {
  return msgs;
}

// Function return type
function _getMessages(): CoreMessage[] {
  return [];
}

// In interface
interface ChatState {
  messages: CoreMessage[];
  history: CoreMessage[];
}

// In type alias
type MessageStore = {
  items: CoreMessage[];
};

// Generic constraint
function _filterMessages<T extends CoreMessage>(msgs: T[]): T[] {
  return msgs;
}

// Type assertion
const _msg = {} as CoreMessage;
