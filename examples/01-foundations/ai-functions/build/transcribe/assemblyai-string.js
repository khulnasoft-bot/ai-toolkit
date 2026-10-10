import { readFile } from 'node:fs/promises';
import { experimental_transcribe as transcribe } from '@ai-toolkit/ai';
import { assemblyai } from '@ai-toolkit/assemblyai';
import { run } from '../lib/run';
run(async () => {
  const result = await transcribe({
    model: assemblyai.transcription('best'),
    audio: Buffer.from(await readFile('./data/galileo.mp3')).toString('base64'),
  });
  console.log('Text:', result.text);
  console.log('Duration:', result.durationInSeconds);
  console.log('Language:', result.language);
  console.log('Segments:', result.segments);
  console.log('Warnings:', result.warnings);
  console.log('Responses:', result.responses);
});
//# sourceMappingURL=assemblyai-string.js.map
