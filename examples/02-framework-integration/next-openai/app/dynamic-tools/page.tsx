'use client';

import { DefaultChatTransport } from '@ai-toolkit/ai';
import { useChat } from '@ai-toolkit/react';
import ChatInput from '@/components/chat-input';
import type { ToolsMessage } from '../api/dynamic-tools/route';

export default function Chat() {
  const { messages, sendMessage, status } = useChat<ToolsMessage>({
    transport: new DefaultChatTransport({ api: '/api/dynamic-tools' }),
  });

  return (
    <div className="flex flex-col py-24 mx-auto w-full max-w-md stretch">
      {messages?.map(message => (
        <div key={message.id} className="whitespace-pre-wrap">
          <strong>{`${message.role}: `}</strong>
          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text':
                return <div key={`${part.type}-${index}`}>{part.text}</div>;

              case 'step-start':
                return index > 0 ? (
                  <div key={`${part.type}-${index}`} className="text-gray-500">
                    <hr className="my-2 border-gray-300" />
                  </div>
                ) : null;

              case 'dynamic-tool': {
                switch (part.state) {
                  case 'input-streaming':
                  case 'input-available':
                  case 'output-available':
                    return <pre key={part.toolCallId}>{JSON.stringify(part, null, 2)}</pre>;
                  case 'output-error':
                    return (
                      <div key={part.toolCallId} className="text-red-500">
                        Error: {part.errorText}
                      </div>
                    );
                }
                return null;
              }

              case 'tool-getWeatherInformation': {
                switch (part.state) {
                  // example of pre-rendering streaming tool calls:
                  case 'input-streaming':
                    return <pre key={part.toolCallId}>{JSON.stringify(part.input, null, 2)}</pre>;
                  case 'input-available':
                    return (
                      <div key={part.toolCallId} className="text-gray-500">
                        Getting weather information for {part.input.city}...
                      </div>
                    );
                  case 'output-available':
                    return (
                      <div key={part.toolCallId} className="text-gray-500">
                        Weather in {part.input.city}: {part.output}
                      </div>
                    );
                  case 'output-error':
                    return (
                      <div key={part.toolCallId} className="text-red-500">
                        Error: {part.errorText}
                      </div>
                    );
                }
                return null;
              }

              default:
                return null;
            }
          })}
          <br />
        </div>
      ))}

      <ChatInput status={status} onSubmit={text => sendMessage({ text })} />
    </div>
  );
}
