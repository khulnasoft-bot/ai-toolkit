import { experimental_transcribe as transcribe } from '@ai-toolkit/ai';
import { gladia } from '@ai-toolkit/gladia';
import { run } from '../lib/run';
run(async () => {
    const result = await transcribe({
        model: gladia.transcription(),
        audio: new URL('https://github.com/khulnasoft/ai-toolkit/raw/refs/heads/main/examples/ai-functions/data/galileo.mp3'),
    });
    console.log('Text:', result.text);
    console.log('Duration:', result.durationInSeconds);
    console.log('Language:', result.language);
    console.log('Segments:', result.segments);
    console.log('Warnings:', result.warnings);
    console.log('Responses:', result.responses);
});
//# sourceMappingURL=gladia-url.js.map