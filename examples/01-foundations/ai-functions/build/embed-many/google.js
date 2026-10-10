import { embedMany } from '@ai-toolkit/ai';
import { google } from '@ai-toolkit/google';
import { run } from '../lib/run';
run(async () => {
    const { embeddings, usage, warnings } = await embedMany({
        model: google.embeddingModel('gemini-embedding-001'),
        values: [
            'sunny day at the beach',
            'rainy afternoon in the city',
            'snowy night in the mountains',
        ],
    });
    console.log(embeddings);
    console.log(usage);
    console.log(warnings);
});
//# sourceMappingURL=google.js.map