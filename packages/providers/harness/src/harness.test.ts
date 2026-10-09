import { describe, expect, it } from 'vitest';
import { HarnessCapabilityUnsupportedError } from './index';

describe('harness base', () => {
  it('exposes a marker-checked error', () => {
    const error = new HarnessCapabilityUnsupportedError({ message: 'nope' });
    expect(HarnessCapabilityUnsupportedError.isInstance(error)).toBe(true);
    expect(HarnessCapabilityUnsupportedError.isInstance(new Error('x'))).toBe(
      false,
    );
  });
});
