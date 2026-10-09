import type { UIMessage } from '@ai-toolkit/ai';
import { loadChat } from '@util/chat-store';
import Chat from './chat';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  // get the chat ID from the URL:
  const { id } = await props.params;

  // load the chat messages:
  const messages = (await loadChat(id)) as UIMessage<{ createdAt: string }>[];

  // display the chat:
  return <Chat id={id} initialMessages={messages} />;
}
