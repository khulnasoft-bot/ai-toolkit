import type { JSONSchema7 } from '@ai-toolkit/provider';
import { describe, expect, it } from 'vitest';
import { z } from 'zod/v3';
import { getRefs } from '../refs';
import { parsePromiseDef } from './promise';

describe('promise', () => {
  it('should be possible to use promise', () => {
    const parsedSchema = parsePromiseDef(z.promise(z.string())._def, getRefs());

    expect(parsedSchema).toStrictEqual({
      type: 'string',
    } satisfies JSONSchema7);
  });
});
