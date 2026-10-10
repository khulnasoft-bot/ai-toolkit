import type { UIToolInvocation } from '@ai-toolkit/ai';
import type { openai } from '@ai-toolkit/openai';

export default function ImageGenerationView({
  invocation,
}: {
  invocation: UIToolInvocation<ReturnType<typeof openai.tools.imageGeneration>>;
}) {
  switch (invocation.state) {
    case 'input-available':
      return (
        <div className="mb-2 bg-gray-900 rounded-xl border border-gray-600 shadow-lg">
          Generating image...
        </div>
      );
    case 'output-available':
      return (
        <div className="mb-2 bg-gray-900 rounded-xl border border-gray-600 shadow-lg">
          <img
            alt="Generated output"
            src={`data:image/png;base64,${invocation.output.result}`}
          />
        </div>
      );
  }
}
