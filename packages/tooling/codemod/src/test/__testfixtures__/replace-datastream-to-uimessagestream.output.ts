// @ts-nocheck
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessageStreamWriter,
} from 'ai';

async function _handler() {
  const stream = await createUIMessageStream();
  const _writer: UIMessageStreamWriter = stream.writer;

  const response = await createUIMessageStreamResponse({
    stream,
  });

  return response;
}

export type MyWriter = UIMessageStreamWriter;

class StreamHandler {
  private stream;
  private writer: UIMessageStreamWriter;

  constructor() {
    this.stream = createUIMessageStream();
    this.writer = this.stream.writer;
  }

  async respond() {
    return createUIMessageStreamResponse(this.stream);
  }
}
