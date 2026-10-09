// @ts-nocheck
import { createDataStream, createDataStreamResponse, type DataStreamWriter } from 'ai';

async function _handler() {
  const stream = await createDataStream();
  const _writer: DataStreamWriter = stream.writer;

  const response = await createDataStreamResponse({
    stream,
  });

  return response;
}

export type MyWriter = DataStreamWriter;

class StreamHandler {
  private stream;
  private writer: DataStreamWriter;

  constructor() {
    this.stream = createDataStream();
    this.writer = this.stream.writer;
  }

  async respond() {
    return createDataStreamResponse(this.stream);
  }
}
