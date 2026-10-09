import type { JSONSchema7 } from '@ai-toolkit/provider';
import { describe, expect, it } from 'vitest';
import { z } from 'zod/v3';
import { getRefs } from '../refs';
import { parseBrandedDef } from './branded';

describe('branded', () => {
  it('should be possible to use branded string', () => {
    const schema = z.string().brand<'x'>();
    const parsedSchema = parseBrandedDef(schema._def, getRefs());

    expect(parsedSchema).toStrictEqual({
      type: 'string',
    } satisfies JSONSchema7);
  });
});
