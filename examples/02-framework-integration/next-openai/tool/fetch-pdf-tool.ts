import { convertUint8ArrayToBase64 } from '@ai-toolkit/provider-utils';
import { UIToolInvocation, tool } from '@ai-toolkit/ai';
import { z } from 'zod';

export const fetchPdfTool = tool({
  description: 'Fetch a PDF',

  inputSchema: z.object({}),
  async execute() {
    const response = await fetch(
      'https://raw.githubusercontent.com/khulnasoft/ai-toolkit/main/examples/ai-functions/data/ai.pdf',
    );

    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const base64 = convertUint8ArrayToBase64(uint8Array);

    return {
      mediaType: 'application/pdf' as const,
      base64,
    };
  },
  toModelOutput: ({ output: { mediaType, base64 } }) => ({
    type: 'content',
    value: [{ type: 'file-data', data: base64, mediaType }],
  }),
});

export type FetchPDFUIToolInvocation = UIToolInvocation<typeof fetchPdfTool>;
