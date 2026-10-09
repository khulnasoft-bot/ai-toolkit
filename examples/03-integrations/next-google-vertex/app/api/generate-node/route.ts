import { generateText } from '@ai-toolkit/ai';
import { vertex } from '@ai-toolkit/google-vertex';

export async function GET() {
  const model = vertex('gemini-1.5-flash');
  const { text } = await generateText({
    model,
    prompt: 'tell me a story',
  });
  return Response.json({ message: text });
}
