'use client';

import { DefaultChatTransport } from '@ai-toolkit/ai';
import { useChat } from '@ai-toolkit/react';
import ChatInput from '@/components/chat-input';

export default function Chat() {
  const { status, sendMessage, messages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/use-chat-image-output' }),
  });

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(message => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) => {
            if (part.type === 'text') {
              return <div key={`${message.id}-text-${index}`}>{part.text}</div>;
            } else if (part.type === 'file' && part.mediaType.startsWith('image/')) {
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={`${message.id}-img-${index}`} src={part.url} alt="Generated" />
              );
            }
            return null;
          })}
        </div>
      ))}

      <ChatInput status={status} onSubmit={text => sendMessage({ text })} />
    </div>
  );
}
