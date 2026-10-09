// @ts-nocheck
import { convertToModelMessages as toModel } from 'ai';

async function _processMessages(uiMessages: any[]) {
  const modelMessages = toModel(uiMessages);
  return modelMessages;
}
