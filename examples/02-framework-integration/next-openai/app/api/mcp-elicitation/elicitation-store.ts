import type { ElicitationResponse } from './types';

// Use globalThis to ensure the Map is shared across all Next.js API routes
// This prevents issues with module reloading in development
declare global {
  var pendingElicitations:
    | Map<
        string,
        {
          resolve: (response: ElicitationResponse) => void;
          reject: (error: Error) => void;
          createdAt: number;
          timeoutId: NodeJS.Timeout;
        }
      >
    | undefined;
}

// Store pending elicitation requests with their resolvers
const pendingElicitationsStore =
  globalThis.pendingElicitations ??
  new Map<
    string,
    {
      resolve: (response: ElicitationResponse) => void;
      reject: (error: Error) => void;
      createdAt: number;
      timeoutId: NodeJS.Timeout;
    }
  >();

// Persist to globalThis
globalThis.pendingElicitations = pendingElicitationsStore;

// Cleanup old/stale elicitations periodically
function cleanupStaleElicitations() {
  const now = Date.now();
  const staleThreshold = 10 * 60 * 1000; // 10 minutes

  const entries = Array.from(pendingElicitationsStore.entries());
  for (const [id, data] of entries) {
    if (now - data.createdAt > staleThreshold) {
      console.log('[store] Cleaning up stale elicitation:', id);
      clearTimeout(data.timeoutId);
      pendingElicitationsStore.delete(id);
    }
  }
}

// Run cleanup every minute
setInterval(cleanupStaleElicitations, 60 * 1000);

export function createPendingElicitation(
  id: string,
): Promise<ElicitationResponse> {
  console.log('[store] Creating pending elicitation:', id);
  console.log(
    '[store] Current pending IDs:',
    Array.from(pendingElicitationsStore.keys()),
  );
  console.log('[store] Current pending count:', pendingElicitationsStore.size);

  // Check if this ID already exists (shouldn't happen, but handle it)
  if (pendingElicitationsStore.has(id)) {
    console.warn('[store] WARNING: Elicitation ID already exists:', id);
    const existing = pendingElicitationsStore.get(id);
    if (existing) {
      clearTimeout(existing.timeoutId);
      pendingElicitationsStore.delete(id);
    }
  }

  return new Promise<ElicitationResponse>((resolve, reject) => {
    // Set a timeout to prevent hanging indefinitely (60 seconds to match MCP timeout)
    const timeoutId = setTimeout(() => {
      if (pendingElicitationsStore.has(id)) {
        console.log('[store] Timeout for elicitation:', id);
        pendingElicitationsStore.delete(id);
        reject(new Error('Request timed out'));
      }
    }, 60 * 1000);

    pendingElicitationsStore.set(id, {
      resolve,
      reject,
      createdAt: Date.now(),
      timeoutId,
    });
    console.log(
      '[store] Added to map. New count:',
      pendingElicitationsStore.size,
    );
  });
}

export function resolvePendingElicitation(
  response: ElicitationResponse,
): boolean {
  console.log('[store] Attempting to resolve:', response.id);
  console.log(
    '[store] Current pending IDs:',
    Array.from(pendingElicitationsStore.keys()),
  );

  const pending = pendingElicitationsStore.get(response.id);

  if (!pending) {
    console.log('[store] Not found in map!');
    return false;
  }

  console.log('[store] Found! Resolving...');
  clearTimeout(pending.timeoutId);
  pending.resolve(response);
  pendingElicitationsStore.delete(response.id);
  console.log(
    '[store] Resolved and removed. Remaining count:',
    pendingElicitationsStore.size,
  );
  return true;
}

export function rejectPendingElicitation(id: string, error: Error): boolean {
  console.log('[store] Attempting to reject:', id);
  const pending = pendingElicitationsStore.get(id);

  if (!pending) {
    console.log('[store] Not found in map for rejection!');
    return false;
  }

  console.log('[store] Found! Rejecting...');
  clearTimeout(pending.timeoutId);
  pending.reject(error);
  pendingElicitationsStore.delete(id);
  console.log(
    '[store] Rejected and removed. Remaining count:',
    pendingElicitationsStore.size,
  );
  return true;
}
