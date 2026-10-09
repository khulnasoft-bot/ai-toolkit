import { createIdGenerator } from '@ai-toolkit/ai';
import { Chat } from './chat';

const generateId = createIdGenerator({ size: 32 });

export default function Page() {
  const id = generateId();

  return <Chat id={id} autoResume={false} initialMessages={[]} />;
}
