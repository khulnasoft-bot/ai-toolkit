import { createChat } from '@util/chat-store';
import { redirect } from 'next/navigation';

export default async function ChatPage() {
  const chatId = await createChat();
  redirect(`/use-chat-persistence-metadata/${chatId}`);
}
