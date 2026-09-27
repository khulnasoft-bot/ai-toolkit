import { openai } from '@ai-toolkit/openai';
import { experimental_generateSpeech as generateSpeech } from '@ai-toolkit/ai';
import { saveAudioFile } from '../lib/save-audio';
import { run } from '../lib/run';

run(async () => {
  const result = await generateSpeech({
    model: openai.speech('tts-1'),
    text: 'Hello from the AI TOOLKIT!',
    language: 'en',
  });

  console.log('Audio:', result.audio);
  console.log('Warnings:', result.warnings);
  console.log('Responses:', result.responses);
  console.log('Provider Metadata:', result.providerMetadata);

  await saveAudioFile(result.audio);
});
