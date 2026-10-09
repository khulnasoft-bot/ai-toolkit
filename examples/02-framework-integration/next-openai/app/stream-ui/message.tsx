'use client';

import { type StreamableValue, useStreamableValue } from '@ai-toolkit/rsc';

export function BotMessage({ textStream }: { textStream: StreamableValue }) {
  const [text] = useStreamableValue(textStream);
  return <Message>{text}</Message>;
}

export function Message({
  role,
  children,
}: {
  role?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 border-b p-2">
      {role != null ? <div className="text-sm text-zinc-500">{role}</div> : null}
      {children}
    </div>
  );
}
