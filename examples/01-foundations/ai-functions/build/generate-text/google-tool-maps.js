import { generateText } from '@ai-toolkit/ai';
import { google, } from '@ai-toolkit/google';
import { run } from '../lib/run';
run(async () => {
    const { text, sources, providerMetadata } = await generateText({
        model: google('gemini-2.5-flash'),
        tools: {
            google_maps: google.tools.googleMaps({}),
        },
        providerOptions: {
            google: {
                retrievalConfig: {
                    latLng: { latitude: 34.09, longitude: -117.88 },
                },
            },
        },
        prompt: 'What are the best Italian restaurants within a 15-minute walk from here?',
    });
    const metadata = providerMetadata?.google;
    const groundingMetadata = metadata?.groundingMetadata;
    console.log('Generated Text:', text);
    console.dir({ sources }, { depth: null });
    console.dir({ groundingMetadata }, { depth: null });
});
//# sourceMappingURL=google-tool-maps.js.map