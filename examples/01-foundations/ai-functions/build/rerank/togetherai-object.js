import { rerank } from '@ai-toolkit/ai';
import { togetherai, } from '@ai-toolkit/togetherai';
import { print } from '../lib/print';
import { run } from '../lib/run';
import { documents } from './documents';
run(async () => {
    const result = await rerank({
        model: togetherai.reranking('Salesforce/Llama-Rank-v1'),
        documents,
        query: 'Which pricing did we get from Oracle?',
        topN: 2,
        providerOptions: {
            togetherai: {
                rankFields: ['from', 'to', 'date', 'subject', 'text'],
            },
        },
    });
    print('Reranking:', result.ranking);
});
//# sourceMappingURL=togetherai-object.js.map