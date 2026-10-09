'use client';

import { DefaultChatTransport } from '@ai-toolkit/ai';
import { useChat } from '@ai-toolkit/react';
import type { AzureOpenAICodeInterpreterMessage } from '@/app/api/chat-azure-code-interpreter-annotation-download/route';
import ChatInput from '@/components/chat-input';
import CodeInterpreterView from '@/components/tool/openai-code-interpreter-view';
import { ResponsesText } from '@/components/tool/responses-text';

export default function TestAzureOpenAICodeInterpreter() {
  const { status, sendMessage, messages } = useChat<AzureOpenAICodeInterpreterMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chat-azure-code-interpreter-annotation-download',
    }),
  });

  return (
    <div className="flex flex-col py-24 mx-auto w-full max-w-md stretch">
      <h1 className="mb-4 text-xl font-bold">Azure OpenAI Code Interpreter Test</h1>

      {messages.map(message => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text':
                return <ResponsesText key={`${part.type}-${index}`} part={part} />;
              case 'tool-code_interpreter':
                return <CodeInterpreterView key={`${part.type}-${index}`} invocation={part} />;
              default:
                return null;
            }
          })}
          {message.metadata?.downloadLinks && message.metadata.downloadLinks.length > 0 && (
            <div className="mt-2 space-y-1">
              {message.metadata.downloadLinks.map(link => (
                <a
                  key={link.url}
                  href={link.url}
                  download={link.filename}
                  className="text-blue-600 hover:underline block"
                >
                  📥 Download {link.filename}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
      <ChatInput status={status} onSubmit={text => sendMessage({ text })} />
    </div>
  );
}
