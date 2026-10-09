import { experimental_generateSpeech as generateSpeech } from '@ai-toolkit/ai';
import { elevenlabs } from '@ai-toolkit/elevenlabs';
import { run } from '../lib/run';
import { saveAudioFile } from '../lib/save-audio';

run(async () => {
  const result = await generateSpeech({
    model: elevenlabs.speech('eleven_multilingual_v2'),
    text: 'This speech has custom voice settings for more expressive output.',
    speed: 1.2,
    providerOptions: {
      elevenlabs: {
        voiceSettings: {
          stability: 0.3, // Lower for more variation
          similarityBoost: 0.8, // Higher for closer to original voice
          style: 0.6, // Control speaking style
          useSpeakerBoost: true, // Enhance voice clarity
        },
      },
    },
  });

  console.log('Audio:', result.audio);
  console.log('Warnings:', result.warnings);
  console.log('Responses:', result.responses);
  console.log('Provider Metadata:', result.providerMetadata);

  await saveAudioFile(result.audio);
});
