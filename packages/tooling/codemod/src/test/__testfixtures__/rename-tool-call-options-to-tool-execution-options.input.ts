// @ts-nocheck
import type { ToolCallOptions } from 'ai';

// Type annotation in function parameter
function _executeWithOptions(options: ToolCallOptions) {
  return options;
}

// Type annotation in variable declaration
const _myOptions: ToolCallOptions = {
  toolCallId: '123',
  messages: [],
};

// Using as type parameter
const _optionsList: ToolCallOptions[] = [];

// Function return type
function _getOptions(): ToolCallOptions {
  return {} as ToolCallOptions;
}

// In interface
interface MyToolConfig {
  options: ToolCallOptions;
}

// In type alias
type ToolOptionsWrapper = {
  inner: ToolCallOptions;
};

// Generic constraint
function _processOptions<T extends ToolCallOptions>(opts: T): T {
  return opts;
}
