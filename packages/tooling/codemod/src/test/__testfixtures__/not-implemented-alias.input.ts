// @ts-nocheck
import { appendClientMessage as ACM, StreamData as SData } from 'ai';
import { appendClientMessage } from 'some-other-package';

const streamData = new SData();
streamData.append('custom-data');

const messages = ACM({
  messages,
  message: lastUserMessage,
});

const _unrelated = appendClientMessage();
