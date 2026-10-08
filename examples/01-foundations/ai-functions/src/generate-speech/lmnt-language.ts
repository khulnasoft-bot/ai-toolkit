import { lmnt } from '@ai-toolkit/lmnt';
import { experimental_generateSpeech as generateSpeech } from '@ai-toolkit/ai';
import { saveAudioFile } from '../lib/save-audio';
import { run } from '../lib/run';

run(async () => {
  const result = await generateSpeech({
    model: lmnt.speech('aurora'),
    text: 'Hola desde el AI TOOLKIT!',
    language: 'es', // Spanish using standardized parameter
  });

  console.log('Audio:', result.audio);
  console.log('Warnings:', result.warnings);
  console.log('Responses:', result.responses);
  console.log('Provider Metadata:', result.providerMetadata);

  await saveAudioFile(result.audio);
});
