import { safeValidateTypes } from '@ai-toolkit/provider-utils';
import { describe, expect, it } from 'vitest';
import { anthropicErrorDataSchema } from './anthropic-error';

describe('anthropicError', () => {
  describe('anthropicErrorDataSchema', () => {
    it('should parse overloaded error', async () => {
      const result = await safeValidateTypes({
        value: {
          type: 'error',
          error: {
            details: null,
            type: 'overloaded_error',
            message: 'Overloaded',
          },
        },
        schema: anthropicErrorDataSchema,
      });

      expect(result).toMatchInlineSnapshot(`
        {
          "rawValue": {
            "error": {
              "details": null,
              "message": "Overloaded",
              "type": "overloaded_error",
            },
            "type": "error",
          },
          "success": true,
          "value": {
            "error": {
              "message": "Overloaded",
              "type": "overloaded_error",
            },
            "type": "error",
          },
        }
      `);
    });
  });
});
