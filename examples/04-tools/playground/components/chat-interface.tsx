'use client';

import { DefaultChatTransport, type UIMessage } from '@ai-toolkit/ai';
import { useChat } from '@ai-toolkit/react';
import { Bot, Loader2, Send, Square, User } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { loadTranscript, saveTranscript } from '@/lib/history';

interface ChatInterfaceProps {
  modelId: string;
  temperature?: number;
  maxOutputTokens?: number;
  system?: string;
  broadcast?: { text: string; nonce: number } | null;
  compact?: boolean;
  persistKey?: string;
}

interface ChatInterfaceProps {
  modelId: string;
  temperature?: number;
  maxOutputTokens?: number;
  system?: string;
  broadcast?: { text: string; nonce: number } | null;
  compact?: boolean;
}

function getText(message: { parts: { type: string; text?: string }[] }) {
  return message.parts
    .map(part => (part.type === 'text' ? (part.text ?? '') : ''))
    .join('');
}

type MessagePart = {
  type: string;
  text?: string;
  url?: string;
  title?: string;
  sourceId?: string;
  toolCallId?: string;
  state?: string;
  input?: unknown;
  output?: unknown;
  errorText?: string;
};

function RenderPart({ part }: { part: MessagePart }) {
  if (part.type === 'text') {
    return <span className="whitespace-pre-wrap">{part.text ?? ''}</span>;
  }
  if (part.type === 'reasoning') {
    return (
      <details className="rounded-md border border-border bg-background/60 px-2 py-1 text-xs">
        <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Reasoning{part.state === 'streaming' ? '…' : ''}
        </summary>
        <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
          {part.text ?? ''}
        </p>
      </details>
    );
  }
  if (part.type === 'source-url') {
    return (
      <a
        href={part.url}
        target="_blank"
        rel="noreferrer"
        className="block truncate text-xs text-primary underline"
      >
        {part.title ?? part.url ?? part.sourceId ?? 'source'}
      </a>
    );
  }
  if (part.type === 'source-document') {
    return (
      <span className="block truncate font-mono text-[11px] text-muted-foreground">
        📄 {part.title ?? part.sourceId ?? 'document'}
      </span>
    );
  }
  if (part.type === 'dynamic-tool' || part.type.startsWith('tool-')) {
    const name =
      part.type === 'dynamic-tool' ? 'tool' : part.type.slice('tool-'.length);
    return (
      <details className="rounded-md border border-border bg-background/60 px-2 py-1 font-mono text-[11px]">
        <summary className="cursor-pointer text-muted-foreground">
          🔧 {name} · {part.state ?? 'done'}
        </summary>
        {part.input != null && (
          <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-words">
            in: {JSON.stringify(part.input).slice(0, 500)}
          </pre>
        )}
        {part.output != null && (
          <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-words">
            out: {JSON.stringify(part.output).slice(0, 500)}
          </pre>
        )}
        {part.errorText && (
          <p className="mt-1 text-destructive">{part.errorText}</p>
        )}
      </details>
    );
  }
  if (part.type === 'step-start') return null;
  if (part.type === 'file') {
    return (
      <span className="block font-mono text-[11px] text-muted-foreground">
        📎 {part.title ?? part.url ?? 'file'}
      </span>
    );
  }
  return null;
}

export function ChatInterface({
  modelId,
  temperature,
  maxOutputTokens,
  system,
  broadcast,
  compact = false,
  persistKey,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [lastLatencyMs, setLastLatencyMs] = useState<number | null>(null);
  const [cleared, setCleared] = useState(false);
  const startRef = useRef<number>(0);
  // Live params ref: useChat binds the transport once, so read current
  // model/temperature/tokens/system per request instead of at mount.
  const paramsRef = useRef({ modelId, temperature, maxOutputTokens, system });
  paramsRef.current = { modelId, temperature, maxOutputTokens, system };
  const initialMessages = useMemo(
    () => (persistKey ? (loadTranscript(persistKey) as UIMessage[]) : []),
    [persistKey],
  );
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        prepareSendMessagesRequest: ({
          messages,
          api,
          headers,
          credentials,
        }) => {
          const p = paramsRef.current;
          return {
            api,
            headers,
            credentials,
            body: {
              messages,
              model: p.modelId,
              temperature: p.temperature,
              maxOutputTokens: p.maxOutputTokens,
              system: p.system,
            },
          };
        },
      }),
    [],
  );
  const {
    messages,
    sendMessage,
    status,
    stop,
    error,
    regenerate,
    setMessages,
  } = useChat({
    transport,
    messages: initialMessages,
    onFinish: () => {
      if (startRef.current) {
        setLastLatencyMs(Date.now() - startRef.current);
        startRef.current = 0;
      }
    },
  });
  const lastBroadcast = useRef<number>(0);

  // Persist working transcript (reload-safe). Skipped after manual clear.
  useEffect(() => {
    if (!persistKey || cleared) return;
    saveTranscript(
      persistKey,
      messages.map(m => ({ id: m.id, role: m.role, parts: m.parts })),
    );
  }, [messages, persistKey, cleared]);

  useEffect(() => {
    if (!broadcast || broadcast.nonce === lastBroadcast.current) return;
    if (!broadcast.text.trim()) return;
    lastBroadcast.current = broadcast.nonce;
    startRef.current = Date.now();
    void sendMessage({ text: broadcast.text.trim() });
  }, [broadcast, sendMessage]);

  const isLoading = status === 'submitted' || status === 'streaming';

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    setInput('');
    startRef.current = Date.now();
    await sendMessage({ text });
  };
  return (
    <div
      className={`flex flex-col rounded-lg border ${compact ? 'h-full min-h-[480px]' : 'h-[600px]'}`}
    >
      <div className="flex items-center justify-between border-b px-4 py-2 text-xs text-muted-foreground">
        <span className="truncate font-mono">{modelId}</span>
        <span className="flex shrink-0 items-center gap-2">
          <span>{isLoading ? status : `${messages.length} messages`}</span>
          {messages.length > 0 && !isLoading && (
            <button
              type="button"
              onClick={() => {
                setMessages([]);
                setCleared(true);
                if (persistKey) saveTranscript(persistKey, []);
              }}
              className="rounded px-1 font-mono text-[10px] hover:text-foreground"
            >
              Clear
            </button>
          )}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="flex h-full min-h-96 items-center justify-center text-center text-muted-foreground">
              <div>
                <Bot className="mx-auto mb-4 size-10 opacity-50" />
                <p>Start a conversation with {modelId}</p>
              </div>
            </div>
          )}
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
            >
              {message.role === 'assistant' && (
                <Bot className="mt-2 size-4 text-primary" />
              )}
              {message.role === 'user' && (
                <div className="max-w-[80%] rounded-lg bg-primary p-3 text-sm text-primary-foreground">
                  <User className="mb-1 size-3" />
                  {getText(message)}
                </div>
              )}
              {message.role === 'assistant' && (
                <div className="flex max-w-[80%] flex-col gap-1.5 rounded-lg bg-muted p-3 text-sm">
                  {(message.parts as MessagePart[]).map((part, i) => (
                    <RenderPart key={`${message.id}-${i}`} part={part} />
                  ))}
                </div>
              )}
            </div>
          ))}
          {isLoading && messages.at(-1)?.role !== 'assistant' && (
            <Loader2 className="size-4 animate-spin text-primary" />
          )}
          {error && (
            <div className="rounded-md border border-destructive/40 p-3 text-sm">
              <p className="text-destructive">
                Request failed: {error.message}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => regenerate()}
              >
                Retry
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between border-t px-4 py-2 font-mono text-[10px] text-muted-foreground">
        <span>
          {isLoading
            ? 'streaming…'
            : lastLatencyMs == null
              ? `${messages.length} messages`
              : `${(lastLatencyMs / 1000).toFixed(1)}s last response`}
        </span>
        <span>
          ~
          {Math.max(
            0,
            Math.round(
              messages.map(m => getText(m).length).reduce((a, b) => a + b, 0) /
                4,
            ),
          )}{' '}
          tokens (est.)
        </span>
      </div>
      <form onSubmit={submit} className="flex gap-2 border-t p-4">
        <input
          value={input}
          onChange={event => setInput(event.target.value)}
          placeholder="Type your message..."
          className="min-w-0 flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          disabled={isLoading}
        />
        {isLoading ? (
          <Button type="button" variant="outline" onClick={() => stop()}>
            <Square className="size-4" />
          </Button>
        ) : (
          <Button type="submit" disabled={!input.trim()}>
            <Send className="size-4" />
          </Button>
        )}
      </form>
    </div>
  );
}
