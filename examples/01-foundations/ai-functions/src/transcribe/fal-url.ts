import { fal } from '@ai-toolkit/fal';
import { experimental_transcribe as transcribe } from '@ai-toolkit/ai';
import { run } from '../lib/run';

run(async () => {
  const result = await transcribe({
    model: fal.transcription('whisper'),
    audio: new URL(
      'https://github.com/khulnasoft/ai-toolkit/raw/refs/heads/main/examples/ai-functions/data/galileo.mp3',
    ),
  });

  console.log('Text:', result.text);
  console.log('Duration:', result.durationInSeconds);
  console.log('Language:', result.language);
  console.log('Segments:', result.segments);
  console.log('Warnings:', result.warnings);
  console.log('Responses:', result.responses);
});
