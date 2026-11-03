import { experimental_transcribe as transcribe } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { run } from '../lib/run';
run(async () => {
  const result = await transcribe({
    model: openai.transcription('whisper-1'),
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
  console.log('Provider Metadata:', result.providerMetadata);
});
//# sourceMappingURL=openai-url.js.map
