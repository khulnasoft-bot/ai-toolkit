'use client';

import { useState } from 'react';

interface Provider {
  name: string;
  package: string;
  create: string;
  model: string;
}

const providers: Provider[] = [
  {
    name: 'OpenAI',
    package: '@ai-toolkit/openai',
    create: 'openai',
    model: 'gpt-4o',
  },
  {
    name: 'Anthropic',
    package: '@ai-toolkit/anthropic',
    create: 'anthropic',
    model: 'claude-3-5-sonnet-20241022',
  },
  {
    name: 'Google',
    package: '@ai-toolkit/google',
    create: 'google',
    model: 'gemini-2.0-flash',
  },
  {
    name: 'Mistral',
    package: '@ai-toolkit/mistral',
    create: 'mistral',
    model: 'pixtral-large-latest',
  },
];

const codeSample = (provider: Provider) => `import { generateText } from 'ai';
import { ${provider.create} } from '${provider.package}';

const { text } = await generateText({
  model: ${provider.create}('${provider.model}'),
  prompt: 'Explain the concept of AI Toolkits.',
});

console.log(text);`;

/**
 * Simplified provider switcher (self-contained port of the legacy
 * ai-sdk.dev preview): pick a provider and see the matching code sample.
 */
export const PreviewSwitchProviders = () => {
  const [active, setActive] = useState(0);
  const provider = providers[active];

  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border border-gray-alpha-400">
      <div className="flex flex-row gap-1 bg-gray-100 border-gray-alpha-400 border-b p-2">
        {providers.map((item, index) => (
          <button
            aria-selected={index === active}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              index === active
                ? 'bg-background-100 font-medium text-gray-1000 shadow-[0_0_0_1px_var(--ds-gray-alpha-400)]'
                : 'text-gray-900 hover:text-gray-1000'
            }`}
            key={item.name}
            onClick={() => setActive(index)}
            role="tab"
            type="button"
          >
            {item.name}
          </button>
        ))}
      </div>
      <pre className="overflow-x-auto bg-background-100 p-4 font-mono text-[13px] leading-6 text-gray-1000">
        {codeSample(provider)}
      </pre>
    </div>
  );
};
