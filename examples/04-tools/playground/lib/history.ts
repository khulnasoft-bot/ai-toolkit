export interface PlaygroundSession {
  id: string;
  title: string;
  prompt: string;
  models: string[];
  temperature: number;
  system?: string;
  maxOutputTokens?: number;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'ai-toolkit-playground-sessions';
const MAX_SESSIONS = 30;

function isBrowser() {
  return (
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  );
}

export function loadSessions(): PlaygroundSession[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PlaygroundSession[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(s => typeof s?.id === 'string' && Array.isArray(s?.models))
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, MAX_SESSIONS);
  } catch {
    return [];
  }
}

function persist(sessions: PlaygroundSession[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(sessions.slice(0, MAX_SESSIONS)),
    );
  } catch {
    // storage full or unavailable — history is best-effort
  }
}

export function createSession(input: {
  prompt: string;
  models: string[];
  temperature: number;
  system?: string;
  maxOutputTokens?: number;
}): PlaygroundSession {
  const now = Date.now();
  const title =
    input.prompt.trim().slice(0, 48) +
      (input.prompt.trim().length > 48 ? '…' : '') || 'Untitled comparison';
  const session: PlaygroundSession = {
    id: `${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    prompt: input.prompt,
    models: input.models,
    temperature: input.temperature,
    system: input.system,
    maxOutputTokens: input.maxOutputTokens,
    createdAt: now,
    updatedAt: now,
  };
  persist([session, ...loadSessions()]);
  return session;
}

export function deleteSession(id: string): PlaygroundSession[] {
  const next = loadSessions().filter(s => s.id !== id);
  persist(next);
  return next;
}

export function clearSessions(): PlaygroundSession[] {
  persist([]);
  return [];
}

const TRANSCRIPT_PREFIX = 'ai-toolkit-playground-transcript-';
const MAX_TRANSCRIPT_MESSAGES = 50;

export function transcriptKey(paneIndex: number) {
  return `${TRANSCRIPT_PREFIX}${paneIndex}`;
}

export function loadTranscript(
  key: string,
): { id: string; role: string; parts: unknown[] }[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as {
      id: string;
      role: string;
      parts: unknown[];
    }[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(m => typeof m?.id === 'string' && Array.isArray(m?.parts))
      .slice(-MAX_TRANSCRIPT_MESSAGES);
  } catch {
    return [];
  }
}

export function saveTranscript(
  key: string,
  messages: { id: string; role: string; parts: unknown[] }[],
) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(
      key,
      JSON.stringify(messages.slice(-MAX_TRANSCRIPT_MESSAGES)),
    );
  } catch {
    // quota or unavailable — transcripts are best-effort
  }
}

export function clearTranscripts(paneCount: number) {
  if (!isBrowser()) return;
  try {
    for (let i = 0; i < paneCount + 4; i++) {
      window.localStorage.removeItem(`${TRANSCRIPT_PREFIX}${i}`);
    }
  } catch {
    // ignore
  }
}
