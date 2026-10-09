'use client';

import { useCompletion } from '@ai-toolkit/react';

export default function Page() {
  const { completion, complete } = useCompletion({
    api: '/api/stream-text',
  });

  return (
    <div className="p-2 flex flex-col gap-2">
      <button
        type="button"
        className="p-2 bg-zinc-100 cursor-pointer"
        onClick={async () => {
          await complete('Why is the sky blue?');
        }}
      >
        Generate
      </button>

      <div data-testid="generation">{completion}</div>
    </div>
  );
}
