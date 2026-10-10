import { experimental_generateSpeech as generateSpeech } from '@ai-toolkit/ai';
import { hume } from '@ai-toolkit/hume';
import { run } from '../lib/run';
import { saveAudioFile } from '../lib/save-audio';
run(async () => {
    const result = await generateSpeech({
        model: hume.speech(),
        text: 'Hello from the AI TOOLKIT!',
        voice: 'nova',
    });
    console.log('Audio:', result.audio);
    console.log('Warnings:', result.warnings);
    console.log('Responses:', result.responses);
    console.log('Provider Metadata:', result.providerMetadata);
    await saveAudioFile(result.audio);
});
//# sourceMappingURL=hume-voice.js.map