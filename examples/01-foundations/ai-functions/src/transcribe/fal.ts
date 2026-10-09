import { readFile } from 'node:fs/promises';
import { experimental_transcribe as transcribe } from '@ai-toolkit/ai';
import { fal } from '@ai-toolkit/fal';
import { run } from '../lib/run';

run(async () => {
  const result = await transcribe({
    model: fal.transcription('whisper'),
    audio: await readFile('data/galileo.mp3'),
  });

  console.log('Text:', result.text);
  console.log('Duration:', result.durationInSeconds);
  console.log('Language:', result.language);
  console.log('Segments:', result.segments);
  console.log('Warnings:', result.warnings);
  console.log('Responses:', result.responses);
});
