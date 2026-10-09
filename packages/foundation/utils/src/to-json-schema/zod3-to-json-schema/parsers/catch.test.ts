import type { JSONSchema7 } from '@ai-toolkit/provider';
import { describe, expect, it } from 'vitest';
import { z } from 'zod/v3';
import { getRefs } from '../refs';
import { parseCatchDef } from './catch';

describe('catch', () => {
  it('should be possible to use catch', () => {
    const parsedSchema = parseCatchDef(z.number().catch(5)._def, getRefs());

    expect(parsedSchema).toStrictEqual({
      type: 'number',
    } satisfies JSONSchema7);
  });
});
