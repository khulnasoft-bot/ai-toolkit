import type { JSONSchema7 } from '@ai-toolkit/provider';
import { describe, expect, it, test } from 'vitest';
import { z } from 'zod/v3';
import { getRefs } from '../refs';
import { parseEffectsDef } from './effects';

describe('effects', () => {
  it('should be possible to use refine', () => {
    const parsedSchema = parseEffectsDef(
      z.number().refine(x => x + 1)._def,
      getRefs(),
    );

    expect(parsedSchema).toStrictEqual({
      type: 'number',
    } satisfies JSONSchema7);
  });

  it('should default to the input type', () => {
    const schema = z.string().transform(arg => parseInt(arg, 10));

    const jsonSchema = parseEffectsDef(schema._def, getRefs());

    expect(jsonSchema).toStrictEqual({
      type: 'string',
    } satisfies JSONSchema7);
  });

  test("should return object based on 'any' strategy", () => {
    const schema = z.string().transform(arg => parseInt(arg, 10));

    const jsonSchema = parseEffectsDef(
      schema._def,
      getRefs({
        effectStrategy: 'any',
      }),
    );

    expect(jsonSchema).toStrictEqual({} satisfies JSONSchema7);
  });
});
