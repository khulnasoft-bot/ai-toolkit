import type { JSONSchema7 } from '@ai-toolkit/provider';
import { describe, expect, it } from 'vitest';
import { z } from 'zod/v3';
import { getRefs } from '../refs';
import { parseReadonlyDef } from './readonly';

describe('readonly', () => {
  it('should be possible to use readonly', () => {
    const parsedSchema = parseReadonlyDef(z.object({}).readonly()._def, getRefs());

    expect(parsedSchema).toStrictEqual({
      type: 'object',
      properties: {},
      additionalProperties: false,
    } satisfies JSONSchema7);
  });
});
