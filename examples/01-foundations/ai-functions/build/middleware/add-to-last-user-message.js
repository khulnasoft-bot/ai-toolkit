export function addToLastUserMessage({ text, params }) {
  const { prompt, ...rest } = params;
  const lastMessage = prompt.at(-1);
  if (lastMessage?.role !== 'user') {
    return params;
  }
  return {
    ...rest,
    prompt: [
      ...prompt.slice(0, -1),
      {
        ...lastMessage,
        content: [{ type: 'text', text }, ...lastMessage.content],
      },
    ],
  };
}
//# sourceMappingURL=add-to-last-user-message.js.map
