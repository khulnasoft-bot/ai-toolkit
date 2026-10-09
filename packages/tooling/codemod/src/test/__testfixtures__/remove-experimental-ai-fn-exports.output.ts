// @ts-nocheck
import { generateObject, generateText, streamObject, streamText } from 'ai';

async function _main() {
  const _result = await generateText({
    model: provider('model-name'),
    prompt: 'Hello',
  });

  const _stream = await streamText({
    model: provider('model-name'),
    prompt: 'Hello',
  });

  const _obj = await generateObject({
    model: provider('model-name'),
    prompt: 'Hello',
  });

  const _objStream = await streamObject({
    model: provider('model-name'),
    prompt: 'Hello',
  });
}
