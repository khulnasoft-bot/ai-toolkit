'use client';

import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithApprovalResponses,
} from '@ai-toolkit/ai';
import { useChat } from '@ai-toolkit/react';
import type { DynamicWeatherWithApprovalAgentUIMessage } from '@/agent/dynamic-weather-with-approval-agent';
import ChatInput from '@/components/chat-input';
import DynamicToolWithApprovalView from '@/components/tool/dynamic-tool-with-approval-view';

export default function TestToolApproval() {
  const { status, sendMessage, messages, addToolApprovalResponse } =
    useChat<DynamicWeatherWithApprovalAgentUIMessage>({
      transport: new DefaultChatTransport({
        api: '/api/chat-tool-approval-dynamic',
      }),
      sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
    });

  console.log(structuredClone(messages));

  return (
    <div className="flex flex-col py-24 mx-auto w-full max-w-md stretch">
      <h1 className="mb-4 text-xl font-bold">Tool Approval Test</h1>

      {messages.map(message => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text':
                return <div key={`${part.type}-${index}`}>{part.text}</div>;
              case 'dynamic-tool':
                return (
                  <DynamicToolWithApprovalView
                    key={`${part.type}-${index}`}
                    invocation={part}
                    addToolApprovalResponse={addToolApprovalResponse}
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
