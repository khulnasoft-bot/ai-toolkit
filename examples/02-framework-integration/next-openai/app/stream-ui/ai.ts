import { createAI } from '@ai-toolkit/rsc';
import { AIState, submitUserMessage, UIState } from './actions';
import { generateId } from '@ai-toolkit/ai';

export const AI = createAI({
  actions: { submitUserMessage },
  initialUIState: [] as UIState,
  initialAIState: { chatId: generateId(), messages: [] } as AIState,
});
