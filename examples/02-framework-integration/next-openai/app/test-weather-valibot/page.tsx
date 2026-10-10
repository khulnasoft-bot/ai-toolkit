'use client';

import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithApprovalResponses,
} from '@ai-toolkit/ai';
import { useChat } from '@ai-toolkit/react';
import type { WeatherValibotAgentUIMessage } from '@/agent/weather-valibot-agent';
import ChatInput from '@/components/chat-input';
import WeatherValibotView from '@/components/tool/weather-valibot-view';

export default function TestWeatherValibot() {
  const { status, sendMessage, messages } =
    useChat<WeatherValibotAgentUIMessage>({
      transport: new DefaultChatTransport({ api: '/api/chat-weather-valibot' }),
      sendAutomaticallyWhen:
        lastAssistantMessageIsCompleteWithApprovalResponses,
    });

  console.log(structuredClone(messages));

  return (
    <div className="flex flex-col py-24 mx-auto w-full max-w-md stretch">
      <h1 className="mb-4 text-xl font-bold">Weather Valibot Test</h1>

      {messages.map(message => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text':
                return <div key={`${part.type}-${index}`}>{part.text}</div>;
              case 'tool-weather':
                return (
                  <WeatherValibotView
                    key={`${part.type}-${index}`}
                    invocation={part}
                  />
                );
              default:
                return null;
            }
          })}
        </div>
      ))}

      <ChatInput status={status} onSubmit={text => sendMessage({ text })} />
    </div>
  );
}
