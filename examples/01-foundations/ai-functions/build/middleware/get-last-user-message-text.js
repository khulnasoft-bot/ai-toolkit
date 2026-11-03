export function getLastUserMessageText({ prompt }) {
  const lastMessage = prompt.at(-1);
  if (lastMessage?.role !== 'user') {
    return undefined;
  }
  return lastMessage.content.length === 0
    ? undefined
    : lastMessage.content
        .filter(c => c.type === 'text')
        .map(c => c.text)
        .join('\n');
}
//# sourceMappingURL=get-last-user-message-text.js.map
