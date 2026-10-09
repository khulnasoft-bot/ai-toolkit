// @ts-nocheck

import { useChat as UC } from '@ai-toolkit/react';
import { generateText as GT, stepCountIs } from 'ai';

async function _foo() {
  const result = await GT({
    model: 'gpt-4',
    messages: [],
    stopWhen: stepCountIs(5),
  });

  const maxSteps = 5;

  await GT({
    model: 'gpt-4',
    messages: [],
    stopWhen: stepCountIs(maxSteps),
  });

  await GT({
    model: 'gpt-4',
    messages: [],
    stopWhen: stepCountIs(5 + 5),
  });

  await GT({
    model: 'gpt-4',
    messages: [],
    stopWhen: stepCountIs(maxSteps + 5),
  });

  const obj = {
    model: 'gpt-4',
    messages: [],
    stopWhen: stepCountIs(maxSteps + 5),
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
    /* FIXME(@ai-toolkit-upgrade-v5): The maxSteps parameter has been removed from useChat. You should now use server-side `stopWhen` conditions for multi-step tool execution control. https://studio.khulnasoft.com/docs/migration-guides/migration-guide-5-0#maxsteps-removal */
    maxSteps: 7,
  });
}

const _config = {
  maxSteps: 10,
  foo: 'bar',
};
