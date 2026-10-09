'use server';

import { streamObject } from '@ai-toolkit/ai';
import { openai } from '@ai-toolkit/openai';
import { createStreamableValue } from '@ai-toolkit/rsc';
import { notificationSchema, type PartialNotification } from './schema';

export async function generateNotifications(context: string) {
  const notificationsStream = createStreamableValue<PartialNotification>();

  const result = streamObject({
    model: openai('gpt-4-turbo'),
    prompt: `Generate 3 notifications for a messages app in this context: ${context}`,
    schema: notificationSchema,
  });

  try {
    for await (const partialObject of result.partialObjectStream) {
      notificationsStream.update(partialObject);
    }
  } finally {
    notificationsStream.done();
  }

  return notificationsStream.value;
}
