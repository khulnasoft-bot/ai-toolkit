/**
 * API key contracts for the AI Gateway platform.
 *
 * Secrets use the format `ak_<keyId>_<secret>` (hex). Only salted scrypt
 * hashes are stored — a leaked database never yields usable keys.
 * `validateKey` enforces revocation and expiry and returns the
 * {@link KeyContext} (tenant, scopes, budget cap) the router and ledger
 * need. Scope enforcement itself stays with the caller.
 */

import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const KEY_PREFIX = 'ak';
const ID_BYTES = 8;
const SECRET_BYTES = 32;
const SALT_BYTES = 16;

/** Stored key record. Never contains the secret. */
export interface ApiKeyRecord {
  readonly id: string;
  readonly keyHash: string;
  readonly salt: string;
  readonly tenantId: string;
  readonly scopes: readonly string[];
  /** Optional spend cap in the ledger currency. Enforced by the gateway. */
  readonly budgetCap?: number;
  /** Epoch millis after which the key is rejected. */
  readonly expiresAt?: number;
  readonly createdAt: number;
  readonly revoked?: boolean;
}

/** What a validated request carries downstream. */
export interface KeyContext {
  readonly keyId: string;
  readonly tenantId: string;
  readonly scopes: readonly string[];
  readonly budgetCap?: number;
}

/** Persistence boundary. Swappable from in-memory to a database. */
export interface KeyStore {
  save(record: ApiKeyRecord): Promise<void>;
  findById(id: string): Promise<ApiKeyRecord | undefined>;
}

export class InMemoryKeyStore implements KeyStore {
  private readonly records = new Map<string, ApiKeyRecord>();

  async save(record: ApiKeyRecord): Promise<void> {
    this.records.set(record.id, record);
  }

  async findById(id: string): Promise<ApiKeyRecord | undefined> {
    return this.records.get(id);
  }
}

export class InvalidKeyError extends Error {
  readonly code: string = 'invalid_key';
  constructor(message = 'API key is invalid') {
    super(message);
    this.name = 'InvalidKeyError';
  }
}

export class ExpiredKeyError extends InvalidKeyError {
  readonly code: string = 'expired_key';
  constructor(message = 'API key has expired') {
    super(message);
    this.name = 'ExpiredKeyError';
  }
}

export class RevokedKeyError extends InvalidKeyError {
  readonly code: string = 'revoked_key';
  constructor(message = 'API key has been revoked') {
    super(message);
    this.name = 'RevokedKeyError';
  }
}

export function hashApiKey(secret: string, salt: string): string {
  return scryptSync(secret, salt, 32).toString('hex');
}

function parseSecret(secret: string): { id: string; secret: string } {
  const parts = secret.split('_');
  if (parts.length !== 3 || parts[0] !== KEY_PREFIX || !parts[1] || !parts[2]) {
    throw new InvalidKeyError();
  }
  return { id: parts[1], secret: parts[2] };
}

/**
 * Create a key record plus the one-time secret. The secret is shown once
 * and never stored — only `{ id, keyHash, salt }` persist.
 */
export function createApiKey(input: {
  tenantId: string;
  scopes?: readonly string[];
  budgetCap?: number;
  expiresAt?: number;
}): { record: ApiKeyRecord; secret: string } {
  const id = randomBytes(ID_BYTES).toString('hex');
  const secretPart = randomBytes(SECRET_BYTES).toString('hex');
  const salt = randomBytes(SALT_BYTES).toString('hex');
  return {
    record: {
      id,
      keyHash: hashApiKey(secretPart, salt),
      salt,
      tenantId: input.tenantId,
      scopes: input.scopes ?? ['gateway:chat'],
      budgetCap: input.budgetCap,
      expiresAt: input.expiresAt,
      createdAt: Date.now(),
    },
    secret: `${KEY_PREFIX}_${id}_${secretPart}`,
  };
}

/**
 * Validate a presented secret against the store. Throws
 * {@link InvalidKeyError} (or its subclasses) on any failure so callers
 * cannot mistake "not found" for "valid".
 */
export async function validateKey(
  store: KeyStore,
  secret: string,
): Promise<KeyContext> {
  const { id, secret: secretPart } = parseSecret(secret);
  const record = await store.findById(id);
  if (!record) {
    throw new InvalidKeyError();
  }
  if (record.revoked) {
    throw new RevokedKeyError();
  }
  if (record.expiresAt !== undefined && Date.now() >= record.expiresAt) {
    throw new ExpiredKeyError();
  }
  const expected = Buffer.from(record.keyHash, 'hex');
  const actual = Buffer.from(hashApiKey(secretPart, record.salt), 'hex');
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    throw new InvalidKeyError();
  }
  return {
    keyId: record.id,
    tenantId: record.tenantId,
    scopes: record.scopes,
    budgetCap: record.budgetCap,
  };
}
