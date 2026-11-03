import * as readline from 'node:readline/promises';
import { streamText } from '@ai-toolkit/ai';
import { vertex } from '@ai-toolkit/google-vertex';
import { presentImages } from '../lib/present-image';
import { run } from '../lib/run';
const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const messages = [];
run(async () => {
  while (true) {
    messages.push({ role: 'user', content: await terminal.question('You: ') });
    const result = streamText({
      model: vertex('gemini-2.5-flash-image-preview'),
      messages,
    });
    process.stdout.write('\nAssistant: ');
    for await (const delta of result.fullStream) {
      switch (delta.type) {
        case 'text-delta': {
          process.stdout.write(delta.text);
          break;
        }
        case 'file': {
          if (delta.file.mediaType.startsWith('image/')) {
            console.log(delta.file);
            await presentImages([delta.file]);
          }
        }
      }
    }
    process.stdout.write('\n\n');
    messages.push(...(await result.response).messages);
  }
});
//# sourceMappingURL=vertex-gemini-2.5-flash-image-preview-chatbot.js.map
