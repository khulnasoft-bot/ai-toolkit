'use client';

import { DefaultChatTransport } from '@ai-toolkit/ai';
import { useChat } from '@ai-toolkit/react';
import type { OpenAICodeInterpreterMessage } from '@/agent/openai-code-interpreter-agent';
import ChatInput from '@/components/chat-input';
import CodeInterpreterView from '@/components/tool/openai-code-interpreter-view';
import { ResponsesText } from '@/components/tool/responses-text';

export default function TestOpenAIWebSearch() {
  const { status, sendMessage, messages } =
    useChat<OpenAICodeInterpreterMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat-openai-code-interpreter',
      }),
    });

  return (
    <div className="flex flex-col py-24 mx-auto w-full max-w-md stretch">
      <h1 className="mb-4 text-xl font-bold">OpenAI Code Interpreter Test</h1>

      {messages.map(message => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map(part => {
            switch (part.type) {
              case 'text': {
                return (
                  <ResponsesText
                    key={`${part.type}-${part.text}`}
                    part={part}
                  />
                );
              }
              case 'tool-executeCode': {
                return (
                  <CodeInterpreterView
                    key={part.toolCallId}
                    invocation={part}
                  />
                );
              }
              default: {
                return null;
              }
            }
          })}
        </div>
      ))}

      <ChatInput status={status} onSubmit={text => sendMessage({ text })} />
    </div>
  );
}
