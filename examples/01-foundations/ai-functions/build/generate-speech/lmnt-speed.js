import { experimental_generateSpeech as generateSpeech } from '@ai-toolkit/ai';
import { lmnt } from '@ai-toolkit/lmnt';
import { run } from '../lib/run';
import { saveAudioFile } from '../lib/save-audio';
run(async () => {
    const result = await generateSpeech({
        model: lmnt.speech('aurora'),
        text: 'Hello from the AI TOOLKIT!',
        speed: 1.5,
    });
    console.log('Audio:', result.audio);
    console.log('Warnings:', result.warnings);
    console.log('Responses:', result.responses);
    console.log('Provider Metadata:', result.providerMetadata);
    await saveAudioFile(result.audio);
});
//# sourceMappingURL=lmnt-speed.js.map