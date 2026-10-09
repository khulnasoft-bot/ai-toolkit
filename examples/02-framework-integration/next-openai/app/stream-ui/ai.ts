import { generateId } from '@ai-toolkit/ai';
import { createAI } from '@ai-toolkit/rsc';
import { type AIState, submitUserMessage, type UIState } from './actions';

export const AI = createAI({
  actions: { submitUserMessage },
  initialUIState: [] as UIState,
  initialAIState: { chatId: generateId(), messages: [] } as AIState,
});
