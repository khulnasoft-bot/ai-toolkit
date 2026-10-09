'use client';

import { useChat } from '@ai-toolkit/react';
import type { WeatherAgentUIMessage } from '@/agent/weather-agent';
import ChatInput from '@/component/chat-input';
import WeatherView from '@/component/weather-view';

export default function Chat() {
  const { status, sendMessage, messages } = useChat<WeatherAgentUIMessage>();

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

              case 'tool-weather': {
                return <WeatherView invocation={part} />;
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
