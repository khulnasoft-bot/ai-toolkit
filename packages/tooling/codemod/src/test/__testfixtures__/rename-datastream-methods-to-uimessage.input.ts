// @ts-nocheck

import { openai } from '@ai-toolkit/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o'),
    messages,
  });

  // Test toDataStream method call
  const _stream = result.toDataStream({ data: 'test' });

  // Test mergeIntoDataStream method call
  const dataStreamWriter = { write: () => {} };
  result.mergeIntoDataStream(dataStreamWriter);

  // Test in more complex expressions
  return result.toDataStream().pipeThrough(transform);

  // Test standalone reference (though less common)
  const _method = result.toDataStream;
  const _mergeMethod = result.mergeIntoDataStream;
}
