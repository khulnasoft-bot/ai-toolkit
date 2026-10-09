// @ts-nocheck
import type { ToolExecutionOptions } from 'ai';

// Type annotation in function parameter
function _executeWithOptions(options: ToolExecutionOptions) {
  return options;
}

// Type annotation in variable declaration
const _myOptions: ToolExecutionOptions = {
  toolCallId: '123',
  messages: [],
};

// Using as type parameter
const _optionsList: ToolExecutionOptions[] = [];

// Function return type
function _getOptions(): ToolExecutionOptions {
  return {} as ToolExecutionOptions;
}

// In interface
interface MyToolConfig {
  options: ToolExecutionOptions;
}

// In type alias
type ToolOptionsWrapper = {
  inner: ToolExecutionOptions;
};

// Generic constraint
function _processOptions<T extends ToolExecutionOptions>(opts: T): T {
  return opts;
}
