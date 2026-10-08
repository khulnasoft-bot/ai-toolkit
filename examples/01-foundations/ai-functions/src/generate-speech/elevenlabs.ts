import { elevenlabs } from '@ai-toolkit/elevenlabs';
import { experimental_generateSpeech as generateSpeech } from '@ai-toolkit/ai';
import { saveAudioFile } from '../lib/save-audio';
import { run } from '../lib/run';

run(async () => {
  const result = await generateSpeech({
    model: elevenlabs.speech('eleven_multilingual_v2'),
    text: 'Hello from the AI TOOLKIT with ElevenLabs!',
    voice: process.env.ELEVENLABS_VOICE_ID || 'your-voice-id-here',
  });

  console.log('Audio:', result.audio);
  console.log('Warnings:', result.warnings);
  console.log('Responses:', result.responses);
  console.log('Provider Metadata:', result.providerMetadata);

  await saveAudioFile(result.audio);
});
