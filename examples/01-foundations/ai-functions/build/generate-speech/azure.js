import { experimental_generateSpeech as generateSpeech } from '@ai-toolkit/ai';
import { azure } from '@ai-toolkit/azure';
import { run } from '../lib/run';
import { saveAudioFile } from '../lib/save-audio';
run(async () => {
    const result = await generateSpeech({
        model: azure.speech('tts-1'), // use your own deployment
        text: 'Hello from the AI TOOLKIT!',
    });
    console.log('Audio:', result.audio);
    console.log('Warnings:', result.warnings);
    console.log('Responses:', result.responses);
    console.log('Provider Metadata:', result.providerMetadata);
    await saveAudioFile(result.audio);
});
//# sourceMappingURL=azure.js.map