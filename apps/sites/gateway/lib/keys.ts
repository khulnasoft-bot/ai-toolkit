import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { ApiKeyRecord, KeyStore } from '@ai-toolkit/security-auth';

/**
 * File-backed key store for development. Keys live in
 * `$GATEWAY_DATA_DIR/keys.json` (gitignored). Production should swap this
 * for a database behind the same `KeyStore` interface.
 */
export class FileKeyStore implements KeyStore {
  private readonly file: string;
  private cache: Map<string, ApiKeyRecord> | undefined;

  constructor(dataDir = process.env.GATEWAY_DATA_DIR ?? './data') {
    this.file = join(dataDir, 'keys.json');
  }

  private load(): Map<string, ApiKeyRecord> {
    if (!this.cache) {
      this.cache = new Map();
      try {
        const raw = readFileSync(this.file, 'utf-8');
        const records = JSON.parse(raw) as ApiKeyRecord[];
        if (Array.isArray(records)) {
          for (const record of records) {
            if (record && typeof record.id === 'string') {
              this.cache.set(record.id, record);
            }
          }
        }
      } catch {
        // missing or corrupt file behaves as an empty store
      }
    }
    return this.cache;
  }

  async save(record: ApiKeyRecord): Promise<void> {
    const records = this.load();
    records.set(record.id, record);
    mkdirSync(dirname(this.file), { recursive: true });
    writeFileSync(this.file, JSON.stringify([...records.values()], null, 2));
  }

  async findById(id: string): Promise<ApiKeyRecord | undefined> {
    return this.load().get(id);
  }
}
