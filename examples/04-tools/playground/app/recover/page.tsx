'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { clearSessions, clearTranscripts, loadSessions } from '@/lib/history';

export default function RecoverPage() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(loadSessions().length);
  }, []);

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <p className="font-mono text-[10px] uppercase tracking-[.2em] text-primary">
        Browser data
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Recover browser data
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Playground sessions are stored locally in your browser (localStorage).
        If the UI ever looks empty after a deploy, your history is still here —
        this page lets you inspect or clear it. Cloud sync via sign-in is not
        implemented yet.
      </p>
      <div className="mt-6 rounded-lg border p-4 text-sm">
        <p>
          Saved sessions: <b className="font-mono">{count}</b>
        </p>
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              clearSessions();
              clearTranscripts(4);
              setCount(0);
            }}
          >
            Clear browser data
          </Button>
          <Link href="/">
            <Button>Back to playground</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
