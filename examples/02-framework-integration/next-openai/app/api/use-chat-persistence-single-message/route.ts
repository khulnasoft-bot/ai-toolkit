import { convertToModelMessages, streamText, type UIMessage } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { loadChat, saveChat } from '@util/chat-store';

export async function POST(req: Request) {
  const { message, chatId }: { message: UIMessage; chatId: string } = await req.json();

  const previousMessages = await loadChat(chatId);
  const messages = [...previousMessages, message];

  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: ({ messages }) => {
      saveChat({ chatId, messages });
    },
  });
}
