import { describe, expect, it } from 'vitest';
import { ReplicateImageModel } from './replicate-image-model';
import { createReplicate } from './replicate-provider';

describe('createReplicate', () => {
  it('creates a provider with required settings', () => {
    const provider = createReplicate({ apiToken: 'test-token' });
    expect(provider.image).toBeDefined();
  });

  it('creates a provider with custom settings', () => {
    const provider = createReplicate({
      apiToken: 'test-token',
      baseURL: 'https://custom.replicate.com',
    });
    expect(provider.image).toBeDefined();
  });

  it('creates an image model instance', () => {
    const provider = createReplicate({ apiToken: 'test-token' });
    const model = provider.image('black-forest-labs/flux-schnell');
    expect(model).toBeInstanceOf(ReplicateImageModel);
  });
});
