import { embed } from '@ai-toolkit/ai';
import { vertex } from '@ai-toolkit/google-vertex';
import { run } from '../lib/run';
run(async () => {
    const { embedding, usage, warnings } = await embed({
        model: vertex.embeddingModel('text-embedding-004'),
        value: 'sunny day at the beach',
    });
    console.log(embedding);
    console.log(usage);
    console.log(warnings);
});
//# sourceMappingURL=google-vertex.js.map