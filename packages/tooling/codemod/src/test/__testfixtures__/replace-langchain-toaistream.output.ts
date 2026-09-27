// @ts-nocheck
import { LangChainAdapter } from 'ai';
import { model } from 'langchain';

const /* WARNING: toAIStream has been removed from streamText.
 See migration guide at https://studio.khulnasoft.com/docs/migration-guides */
  stream = LangChainAdapter.toDataStream(model.stream(), {
    onToken: token => console.log(token),
  });

const response = new Response(stream);
