import { describe, expect, it } from 'vitest';
import {
  createApiKey,
  ExpiredKeyError,
  hashApiKey,
  InMemoryKeyStore,
  InvalidKeyError,
  RevokedKeyError,
  validateKey,
} from './api-keys';

describe('api keys', () => {
  it('round-trips create -> validate', async () => {
    const store = new InMemoryKeyStore();
    const { record, secret } = createApiKey({
      tenantId: 'acme',
      scopes: ['gateway:chat'],
      budgetCap: 25,
    });
    await store.save(record);

    await expect(validateKey(store, secret)).resolves.toEqual({
      keyId: record.id,
      tenantId: 'acme',
      scopes: ['gateway:chat'],
      budgetCap: 25,
    });
  });

  it('rejects malformed and unknown secrets', async () => {
    const store = new InMemoryKeyStore();
    await expect(validateKey(store, 'not-a-key')).rejects.toBeInstanceOf(
      InvalidKeyError,
    );
    await expect(
      validateKey(store, 'ak_deadbeef_deadbeef'),
    ).rejects.toBeInstanceOf(InvalidKeyError);
  });

  it('rejects wrong secrets for a known id', async () => {
    const store = new InMemoryKeyStore();
    const { record } = createApiKey({ tenantId: 'acme' });
    await store.save(record);

    await expect(
      validateKey(store, `ak_${record.id}_wrong`),
    ).rejects.toBeInstanceOf(InvalidKeyError);
  });

  it('rejects revoked and expired keys', async () => {
    const store = new InMemoryKeyStore();
    const revoked = createApiKey({ tenantId: 'acme' });
    await store.save({ ...revoked.record, revoked: true });
    await expect(validateKey(store, revoked.secret)).rejects.toBeInstanceOf(
      RevokedKeyError,
    );

    const expired = createApiKey({
      tenantId: 'acme',
      expiresAt: Date.now() - 1000,
    });
    await store.save(expired.record);
    await expect(validateKey(store, expired.secret)).rejects.toBeInstanceOf(
      ExpiredKeyError,
    );
  });

  it('stores hashes, never secrets', () => {
    const { record, secret } = createApiKey({ tenantId: 'acme' });
    expect(record.keyHash).not.toContain(secret.split('_')[2]);
    expect(record.keyHash).toBe(hashApiKey(secret.split('_')[2], record.salt));
  });
});
