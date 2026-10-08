import { hume } from '@ai-toolkit/hume';
import { experimental_generateSpeech as generateSpeech } from '@ai-toolkit/ai';
import { saveAudioFile } from '../lib/save-audio';
import { run } from '../lib/run';

run(async () => {
  const result = await generateSpeech({
    model: hume.speech(),
    text: 'Hello from the AI TOOLKIT!',
    instructions: 'Speak in a slow and steady tone',
  });

  console.log('Audio:', result.audio);
  console.log('Warnings:', result.warnings);
  console.log('Responses:', result.responses);
  console.log('Provider Metadata:', result.providerMetadata);

  await saveAudioFile(result.audio);
});
