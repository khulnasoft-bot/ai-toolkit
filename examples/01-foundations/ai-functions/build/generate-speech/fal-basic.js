import { experimental_generateSpeech as generateSpeech } from '@ai-toolkit/ai';
import { fal } from '@ai-toolkit/fal';
import { run } from '../lib/run';
import { saveAudioFile } from '../lib/save-audio';
run(async () => {
  const result = await generateSpeech({
    model: fal.speech('fal-ai/minimax/speech-02-hd'),
    text: 'Hello from the AI TOOLKIT via fal speech!',
    outputFormat: 'hex',
  });
  console.log('Audio:', result.audio);
  console.log('Warnings:', result.warnings);
  console.log('Responses:', result.responses);
  console.log('Provider Metadata:', result.providerMetadata);
  await saveAudioFile(result.audio);
});
//# sourceMappingURL=fal-basic.js.map
