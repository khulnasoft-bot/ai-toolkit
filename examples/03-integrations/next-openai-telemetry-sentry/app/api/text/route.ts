import { generateText } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const { text } = await generateText({
    model: openai('gpt-4-turbo'),
    maxOutputTokens: 100,
    prompt,
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'example-function-id',
      metadata: { example: 'value' },
    },
  });

  return new Response(JSON.stringify({ text }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
