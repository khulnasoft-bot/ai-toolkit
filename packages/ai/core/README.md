# 🚀 AI TOOLKIT

<div align="center">

[![npm version](https://img.shields.io/npm/v/ai-toolkit?style=flat-square&logo=npm&logoColor=white&labelColor=cb0000&color=cb0000)](https://www.npmjs.com/package/ai-toolkit)
[![npm downloads](https://img.shields.io/npm/dm/ai-toolkit?style=flat-square&logo=npm&logoColor=white&labelColor=cb0000&color=cb0000)](https://www.npmjs.com/package/ai-toolkit)
[![GitHub stars](https://img.shields.io/github/stars/khulnasoft/ai-toolkit?style=flat-square&logo=github&logoColor=white&labelColor=24292e&color=24292e)](https://github.com/khulnasoft/ai-toolkit)
[![GitHub forks](https://img.shields.io/github/forks/khulnasoft/ai-toolkit?style=flat-square&logo=github&logoColor=white&labelColor=24292e&color=24292e)](https://github.com/khulnasoft/ai-toolkit)
[![GitHub issues](https://img.shields.io/github/issues/khulnasoft/ai-toolkit?style=flat-square&logo=github&logoColor=white&labelColor=24292e&color=24292e)](https://github.com/khulnasoft/ai-toolkit/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/khulnasoft/ai-toolkit?style=flat-square&logo=github&logoColor=white&labelColor=24292e&color=24292e)](https://github.com/khulnasoft/ai-toolkit/pulls)
[![License](https://img.shields.io/npm/l/ai-toolkit?style=flat-square&logo=open-source-initiative&logoColor=white&labelColor=3da639&color=3da639)](https://github.com/khulnasoft/ai-toolkit/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue?style=flat-square&logo=typescript&logoColor=white&labelColor=3178c6&color=3178c6)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=flat-square&logo=node.js&logoColor=white&labelColor=339933&color=339933)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square&logo=git&logoColor=white&labelColor=2ea043&color=2ea043)](http://makeapullrequest.com)
[![Discord](https://img.shields.io/discord/1081022898786365453?style=flat-square&logo=discord&logoColor=white&labelColor=5865f2&color=5865f2)](https://discord.gg/khulnasoft)

[![GitHub Discussions](https://img.shields.io/github/discussions/khulnasoft/ai-toolkit?style=for-the-badge&logo=github&logoColor=white&labelColor=24292e&color=24292e)](https://github.com/khulnasoft/ai-toolkit/discussions)
[![Documentation](https://img.shields.io/badge/📖_Docs-Latest-blue?style=for-the-badge&logo=readthedocs&logoColor=white&labelColor=2196f3&color=2196f3)](https://sdk.khulnasoft.com/docs)

</div>

<div align="center">

## 🌟 **The Ultimate TypeScript AI Toolkit**

[AI TOOLKIT](https://sdk.khulnasoft.com/docs) is a **production-ready**, **type-safe** TypeScript toolkit for building **AI-powered applications** with seamless integration across **Next.js, React, Svelte, Vue** and **Node.js** runtimes.

</div>

---

## ✨ **Key Features**

<table align="center">
<tr>
<td width="50%">

**🔗 Seamless AI Integration**

- 🤖 **20+ AI Providers**: OpenAI, Anthropic, Google, Azure, Groq, Cohere, and more
- 🔄 **Unified API**: Single interface for all providers
- ⚡ **Streaming Support**: Real-time AI responses
- 🛡️ **Error Handling**: Robust fallback mechanisms

</td>
<td width="50%">

**🎯 Framework Agnostic**

- ⚛️ **React & Next.js**: Hooks and components
- 🎨 **Svelte & Vue**: Reactive UI integrations
- 🟢 **Node.js**: Server-side AI processing
- 📦 **Universal**: Works everywhere JavaScript runs

</td>
</tr>
<tr>
<td width="50%">

**👨‍� Developer Experience**

- 📝 **100% TypeScript**: Full type safety
- 🚀 **Zero Config**: Get started in minutes
- 📚 **Comprehensive Docs**: Detailed guides & examples
- 🔧 **Extensible**: Easy to customize and extend

</td>
<td width="50%">

**🏗️ Production Ready**

- ⚡ **High Performance**: Optimized for production
- 🛡️ **Secure**: Best practices built-in
- 📊 **Monitoring**: Built-in logging and metrics
- 🔄 **Reliable**: Battle-tested in production

</td>
</tr>
</table>

---

## 📚 **Documentation & Resources**

| Resource                    | Description                       | Link                                                                |
| --------------------------- | --------------------------------- | ------------------------------------------------------------------- |
| **📖 Full Documentation**   | Complete API reference and guides | [docs.khulnasoft.com](https://sdk.khulnasoft.com/docs)              |
| **🔧 API Reference**        | Detailed API documentation        | [API Reference](https://sdk.khulnasoft.com/docs/reference)          |
| **🎨 Examples & Templates** | Ready-to-use project templates    | [Templates](https://khulnasoft.com/templates?type=ai)               |
| **💬 Community**            | Get help and share ideas          | [Discussions](https://github.com/khulnasoft/ai-toolkit/discussions) |

---

## � **Quick Start**

### 📋 **Prerequisites**

- **Node.js** 18 or higher
- **Package Manager**: npm, yarn, pnpm, or bun

### 📦 **Installation**

<div align="center">

| Package Manager | Command                  |
| --------------- | ------------------------ |
| **npm**         | `npm install ai-toolkit` |
| **yarn**        | `yarn add ai-toolkit`    |
| **pnpm**        | `pnpm add ai-toolkit`    |
| **bun**         | `bun add ai-toolkit`     |

</div>

### ⚡ **Environment Setup**

Create a `.env.local` file in your project root:

```env
# OpenAI (most popular)
OPENAI_API_KEY=your_openai_api_key_here

# Or choose another provider:
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
```

#### 📦 **Install Provider Package**

```bash
# For OpenAI (most popular)
npm install @ai-toolkit/openai

# Or any other provider
npm install @ai-toolkit/anthropic
npm install @ai-toolkit/google
npm install @ai-toolkit/groq
```

#### � **Basic Text Generation**

```typescript
import { generateText } from 'ai-toolkit';
import { openai } from '@ai-toolkit/openai';

export async function generateResponse(prompt: string) {
  const { text } = await generateText({
    model: openai('gpt-4o'),
    system: 'You are a helpful AI assistant.',
    prompt,
    maxTokens: 500,
    temperature: 0.7,
  });

  return text;
}

// Usage
const response = await generateResponse('Explain quantum computing simply');
console.log(response);
```

#### 🌊 **Streaming Responses**

```typescript
import { streamText } from 'ai-toolkit';
import { anthropic } from '@ai-toolkit/anthropic';

export async function* streamResponse(prompt: string) {
  const { textStream } = await streamText({
    model: anthropic('claude-3-5-sonnet-20241022'),
    system: 'You are a creative writer.',
    prompt: 'Write a short story about time travel.',
  });

  for await (const chunk of textStream) {
    yield chunk;
  }
}

// Usage
for await (const chunk of streamResponse('Tell me about AI')) {
  process.stdout.write(chunk);
}
```

### 🎨 **AI TOOLKIT UI**

The [AI TOOLKIT UI](https://sdk.khulnasoft.com/docs/ai-toolkit-ui/overview) provides **framework-agnostic hooks** to build **AI chatbots** and **generative UI components** with **real-time streaming**.

<div align="center">

| Framework         | Hook                             | Status              |
| ----------------- | -------------------------------- | ------------------- |
| **React/Next.js** | `useChat`, `useCompletion`       | ✅ Production Ready |
| **Svelte**        | `createChat`, `createCompletion` | ✅ Production Ready |
| **Vue**           | `useChat`, `useCompletion`       | ✅ Production Ready |
| **Solid.js**      | `createChat`, `createCompletion` | ✅ Production Ready |

</div>

#### ⚛️ **React/Next.js Example**

```tsx
// app/page.tsx
'use client';
import { useChat } from 'ai-toolkit/react';
import { useState } from 'react';

export default function ChatInterface() {
  const { messages, input, handleSubmit, handleInputChange, status, error } =
    useChat();
  const [isTyping, setIsTyping] = useState(false);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-gray-50 rounded-lg p-4 mb-4 min-h-[400px]">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center">
            Start a conversation with AI 🤖
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`mb-4 p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-100 ml-auto max-w-[80%]'
                  : 'bg-white border border-gray-200 max-w-[80%]'
              }`}
            >
              <div className="font-semibold text-sm mb-1">
                {message.role === 'user' ? '👤 You' : '🤖 AI'}
              </div>
              <div className="text-gray-800">{message.content}</div>
            </div>
          ))
        )}

        {status === 'loading' && (
          <div className="text-gray-500 italic">AI is thinking...</div>
        )}

        {error && (
          <div className="text-red-500 bg-red-50 p-3 rounded-lg">
            Error: {error.message}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={status !== 'ready'}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status !== 'ready' || !input.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
```

#### 🚀 **Next.js API Route**

```ts
// app/api/chat/route.ts
import { streamText } from 'ai-toolkit';
import { openai } from '@ai-toolkit/openai';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 });
    }

    const result = streamText({
      model: openai('gpt-4o'),
      system: `You are a helpful AI assistant. Be concise and clear.
      
      Guidelines:
      - Respond in a friendly, professional tone
      - Provide accurate, helpful information
      - If you don't know something, say so
      - Keep responses focused on the user's question`,
      messages,
      temperature: 0.7,
      maxTokens: 1000,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
```

#### 🎯 **Svelte Example**

```svelte
<!-- +page.svelte -->
<script lang="ts">
  import { createChat } from 'ai-toolkit/svelte';

  const { messages, input, handleSubmit, handleInputChange, status, error } =
    createChat();
</script>

<div class="chat-container">
  <div class="messages">
    {#each $messages as message}
      <div class="message" class:user={message.role === 'user'}>
        <strong>{message.role === 'user' ? 'You' : 'AI'}:</strong>
        <p>{message.content}</p>
      </div>
    {/each}

    {#if $status === 'loading'}
      <div class="typing-indicator">AI is typing...</div>
    {/if}

    {#if $error}
      <div class="error">Error: {$error.message}</div>
    {/if}
  </div>

  <form on:submit|preventDefault={handleSubmit}>
    <input
      bind:value={$input}
      on:input={handleInputChange}
      placeholder="Type your message..."
      disabled={$status !== 'ready'}
    />
    <button type="submit" disabled={$status !== 'ready' || !$input.trim()}>
      Send
    </button>
  </form>
</div>

<style>
  .chat-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }

  .message {
    padding: 10px;
    margin: 10px 0;
    border-radius: 8px;
    background: #f5f5f5;
  }

  .message.user {
    background: #e3f2fd;
    margin-left: auto;
    max-width: 80%;
  }

  .typing-indicator {
    color: #666;
    font-style: italic;
  }

  .error {
    color: #d32f2f;
    background: #ffebee;
    padding: 10px;
    border-radius: 4px;
  }
</style>
```

---

## 📦 Templates

We provide **ready-to-use templates** with AI TOOLKIT integrations for different frameworks, providers, and use cases.  
Check them out [here](https://khulnasoft.com/templates?type=ai).

---

## 🌎 Community

Join the **AI TOOLKIT** community to discuss, share ideas, and contribute!  
💬 [GitHub Discussions](https://github.com/khulnasoft/ai-toolkit/discussions)  
🐦 [Follow us on Twitter](https://twitter.com/khulnasoft)  
🚀 [Join our Discord](https://discord.gg/khulnasoft)

---

## 🤝 Contributing

We welcome contributions! Before you start, please read our [Contribution Guidelines](https://github.com/khulnasoft/ai-toolkit/blob/main/CONTRIBUTING.md).

---

## 👨‍💻 Authors & Credits

Developed by **[Khulnasoft](https://khulnasoft.com)** and **[Next.js](https://nextjs.org)** team members, with valuable contributions from the **Open Source Community**.  
[View Contributors](https://github.com/khulnasoft/ai-toolkit/graphs/contributors) 💙

---

## 📜 License

This project is licensed under the **MIT License**. See the full [LICENSE](https://github.com/khulnasoft/ai-toolkit/blob/main/LICENSE) for details.

---

## 🎨 **Project Templates & Examples**

<div align="center">

### 🚀 **Ready-to-Use Templates**

| Template         | Framework | Provider  | Use Case             | Quick Start                                           |
| ---------------- | --------- | --------- | -------------------- | ----------------------------------------------------- |
| **AI Chatbot**   | Next.js   | OpenAI    | Chat Interface       | [→](https://khulnasoft.com/templates/chat-nextjs)     |
| **AI Assistant** | React     | Anthropic | Virtual Assistant    | [→](https://khulnasoft.com/templates/assistant-react) |
| **AI Writer**    | Svelte    | Google    | Content Generation   | [→](https://khulnasoft.com/templates/writer-svelte)   |
| **AI Dashboard** | Vue       | Multiple  | Analytics & Insights | [→](https://khulnasoft.com/templates/dashboard-vue)   |
| **AI API**       | Node.js   | OpenAI    | Backend Service      | [→](https://khulnasoft.com/templates/api-node)        |

</div>

<div align="center">

[![Browse All Templates](https://img.shields.io/badge/📖_Browse_All_Templates-100%25-blue?style=for-the-badge&logo=github&logoColor=white&labelColor=2196f3&color=2196f3)](https://khulnasoft.com/templates?type=ai)

</div>

---

## 🌍 **Community & Support**

<div align="center">

### 💬 **Get Help & Connect**

| Platform               | Purpose                  | Link                                                           |
| ---------------------- | ------------------------ | -------------------------------------------------------------- |
| **GitHub Discussions** | Questions, ideas, help   | [Join →](https://github.com/khulnasoft/ai-toolkit/discussions) |
| **Discord Server**     | Real-time chat & support | [Join →](https://discord.gg/khulnasoft)                        |
| **Twitter/X**          | Updates & announcements  | [Follow →](https://twitter.com/khulnasoft)                     |
| **GitHub Issues**      | Bug reports & features   | [Report →](https://github.com/khulnasoft/ai-toolkit/issues)    |

</div>

### 🤝 **Contributing**

We **welcome contributions** from the community! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

<div align="center">

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge&logo=git&logoColor=white&labelColor=2ea043&color=2ea043)](http://makeapullrequest.com)

</div>

#### 🚀 **How to Contribute**

1. **🍴 Fork** the repository
2. **🌿 Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **💻 Make** your changes with tests
4. **✅ Run** tests (`npm test`)
5. **📤 Commit** your changes (`git commit -m 'Add amazing feature'`)
6. **📤 Push** to the branch (`git push origin feature/amazing-feature`)
7. **🔀 Open** a Pull Request

📖 **Read our [Contribution Guidelines](https://github.com/khulnasoft/ai-toolkit/blob/main/CONTRIBUTING.md)** for detailed instructions.

---

## 👥 **Authors & Contributors**

<div align="center">

### 🏢 **Primary Development**

**[Khulnasoft](https://khulnasoft.com)** × **[Next.js Team](https://nextjs.org)**

Built with ❤️ by the open source community

</div>

<div align="center">

[![Contributors](https://img.shields.io/github/contributors/khulnasoft/ai-toolkit?style=for-the-badge&logo=github&logoColor=white&labelColor=24292e&color=24292e)](https://github.com/khulnasoft/ai-toolkit/graphs/contributors)
[![GitHub stars](https://img.shields.io/github/stars/khulnasoft/ai-toolkit?style=for-the-badge&logo=github&logoColor=white&labelColor=24292e&color=24292e)](https://github.com/khulnasoft/ai-toolkit)

**[👀 View All Contributors](https://github.com/khulnasoft/ai-toolkit/graphs/contributors)** 💙

</div>

---

## 📄 **License**

<div align="center">

[![License](https://img.shields.io/npm/l/ai-toolkit?style=for-the-badge&logo=open-source-initiative&logoColor=white&labelColor=3da639&color=3da639)](https://github.com/khulnasoft/ai-toolkit/blob/main/LICENSE)

This project is licensed under the **MIT License**.

📖 **View the full [LICENSE](https://github.com/khulnasoft/ai-toolkit/blob/main/LICENSE)** for details.

</div>

---

<div align="center">

## 🎉 **Thank You for Using AI TOOLKIT!**

Made with ❤️ by **[Khulnasoft](https://khulnasoft.com)**

[![Back to top](https://img.shields.io/badge/⬆️_Back_to_Top-000000?style=for-the-badge)](#-ai-toolkit)

</div>
