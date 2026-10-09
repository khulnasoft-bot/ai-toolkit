import { validateTypes } from '@ai-toolkit/provider-utils';
import { describe, expectTypeOf, it } from 'vitest';
import { type UIMessageChunk, uiMessageChunkSchema } from './ui-message-chunks';

describe('UI message chunks type', () => {
  it('parsed UI message chunk should have UIMessageChunk type', async () => {
    const chunk = await validateTypes({
      schema: uiMessageChunkSchema,
      value: {
        type: 'text-delta',
        delta: 'Hello, world!',
        id: '123',
      },
    });

    expectTypeOf(chunk).toEqualTypeOf<UIMessageChunk>();
  });
});
