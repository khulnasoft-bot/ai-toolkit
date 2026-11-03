import { readFile } from 'node:fs/promises';
import { experimental_transcribe as transcribe } from '@ai-toolkit/ai';
import { run } from '../lib/run';
import { registry } from './setup-registry';
run(async () => {
  const result = await transcribe({
    model: registry.transcriptionModel('openai:whisper-1'),
    audio: await readFile('../data/galileo.mp3'),
  });
  console.log('Transcript:', result.text);
  console.log('Language:', result.language);
  console.log('Duration:', result.durationInSeconds);
  console.log('Segments:', result.segments);
});
//# sourceMappingURL=transcribe-openai.js.map
