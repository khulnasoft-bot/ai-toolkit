// @ts-nocheck

import { useChat } from '@ai-toolkit/react';
import { generateText } from 'ai';

async function _foo() {
  const result = await generateText({
    model: 'gpt-4',
    messages: [],
    maxSteps: 5,
  });

  const maxSteps = 5;

  await generateText({
    model: 'gpt-4',
    messages: [],
    maxSteps,
  });

  await generateText({
    model: 'gpt-4',
    messages: [],
    maxSteps: 5 + 5,
  });

  await generateText({
    model: 'gpt-4',
    messages: [],
    maxSteps: maxSteps + 5,
  });

  const obj = {
    model: 'gpt-4',
    messages: [],
    maxSteps: maxSteps + 5,
  };

  await generateText(obj);

  const _obj2 = {
    model: 'gpt-4',
    messages: [],
    maxSteps: maxSteps + 5,
  };

  return result;
}

export function ChatComponent() {
  useChat({
    model: 'gpt-4',
    maxSteps: 7,
  });
}

const _config = {
  maxSteps: 10,
  foo: 'bar',
};
