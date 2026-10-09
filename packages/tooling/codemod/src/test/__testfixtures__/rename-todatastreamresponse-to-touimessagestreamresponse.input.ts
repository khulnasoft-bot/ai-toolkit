// @ts-nocheck
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
  });

  return result.toDataStreamResponse();
}

// Another example
const stream = streamText({ model, prompt });
const _response = stream.toDataStreamResponse({
  status: 200,
  headers: { custom: 'header' },
});

const _result1 = result.toDataStreamResponse({
  getErrorMessage: _error => {
    return {
      errorCode: 'STREAM_ERROR',
      message: 'An error occurred while processing your request',
    };
  },
});

// Variable object with getErrorMessage
const opts = {
  getErrorMessage: _error => {
    return {
      errorCode: 'STREAM_ERROR',
      message: 'An error occurred while processing your request',
    };
  },
};
const _result2 = result.toDataStreamResponse(opts);
