import { describe, it } from 'vitest';
import transformer from '../codemods/v6/rename-ai-to-ai-toolkit';
import { testTransform } from './test-utils';

describe('rename-ai-to-ai-toolkit', () => {
  it('transforms correctly', () => {
    testTransform(transformer, 'rename-ai-to-ai-toolkit');
  });
});
