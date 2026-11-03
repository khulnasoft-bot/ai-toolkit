import { experimental_generateSpeech as generateSpeech } from '@ai-toolkit/ai';
import { elevenlabs } from '@ai-toolkit/elevenlabs';
import { run } from '../lib/run';
import { saveAudioFile } from '../lib/save-audio';
run(async () => {
  const result = await generateSpeech({
    model: elevenlabs.speech('eleven_multilingual_v2'),
    text: 'This sentence uses context for better prosody.',
    providerOptions: {
      elevenlabs: {
        previous_text: 'The previous sentence ended with a question mark?',
        next_text: 'The next sentence will continue the story.',
        seed: 42, // For reproducible generation
      },
    },
  });
  console.log('Audio:', result.audio);
  console.log('Warnings:', result.warnings);
  console.log('Responses:', result.responses);
  console.log('Provider Metadata:', result.providerMetadata);
  console.log('Used context for improved prosody and consistency');
  await saveAudioFile(result.audio);
});
//# sourceMappingURL=elevenlabs-context.js.map
