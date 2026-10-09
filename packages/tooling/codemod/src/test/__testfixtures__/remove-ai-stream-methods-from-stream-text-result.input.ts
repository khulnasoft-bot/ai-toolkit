// @ts-nocheck
import { streamText } from 'ai';

async function _handler(_req, res) {
  const stream = streamText({
    model: 'gpt-4',
    prompt: 'Hello',
  });

  const /* WARNING: toAIStream has been removed from streamText.
   See migration guide at https://studio.khulnasoft.com/docs/migration-guides */
    _aiStream = stream.toAIStream();
  /* WARNING: pipeAIStreamToResponse has been removed from streamText.
   See migration guide at https://studio.khulnasoft.com/docs/migration-guides */
  stream.pipeAIStreamToResponse(res);
  /* WARNING: toAIStreamResponse has been removed from streamText.
   See migration guide at https://studio.khulnasoft.com/docs/migration-guides */
  return stream.toAIStreamResponse();
}
