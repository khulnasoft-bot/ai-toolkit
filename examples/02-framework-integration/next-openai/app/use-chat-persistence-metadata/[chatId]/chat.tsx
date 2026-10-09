'use client';

import { DefaultChatTransport } from '@ai-toolkit/ai';
import { zodSchema } from '@ai-toolkit/provider-utils';
import { type UIMessage, useChat } from '@ai-toolkit/react';
import { z } from 'zod';
import ChatInput from '@/components/chat-input';

export default function Chat({
  id,
  initialMessages,
}: {
  id?: string | undefined;
  initialMessages?: UIMessage<{ createdAt: string }>[];
} = {}) {
  const { sendMessage, status, messages } = useChat({
    id, // use the provided chatId
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/use-chat-persistence-metadata',
    }),
    messageMetadataSchema: zodSchema(
      z.object({
        createdAt: z.string().datetime(),
      }),
    ),
  });

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.metadata?.createdAt && (
            <div>Created at: {new Date(m.metadata.createdAt).toLocaleString()}</div>
          )}
          {m.parts.map((part, index) => {
            if (part.type === 'text') {
              return <div key={`${m.id}-text-${index}`}>{part.text}</div>;
            }
            return null;
          })}
        </div>
      ))}

      <ChatInput status={status} onSubmit={text => sendMessage({ text })} />
    </div>
  );
}
