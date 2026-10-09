// @ts-nocheck

import { useChat as UC } from '@ai-toolkit/react';
import { generateText as GT } from 'ai';

async function _foo() {
  const result = await GT({
    model: 'gpt-4',
    messages: [],
    maxSteps: 5,
  });

  const maxSteps = 5;

  await GT({
    model: 'gpt-4',
    messages: [],
    maxSteps,
  });

  await GT({
    model: 'gpt-4',
    messages: [],
    maxSteps: 5 + 5,
  });

  await GT({
    model: 'gpt-4',
    messages: [],
    maxSteps: maxSteps + 5,
  });

  const obj = {
    model: 'gpt-4',
    messages: [],
    maxSteps: maxSteps + 5,
  };

  await GT(obj);

  const _obj2 = {
    model: 'gpt-4',
    messages: [],
    maxSteps: maxSteps + 5,
  };

  return result;
}

export function ChatComponent() {
  UC({
    model: 'gpt-4',
    maxSteps: 7,
  });
}

const _config = {
  maxSteps: 10,
  foo: 'bar',
};
