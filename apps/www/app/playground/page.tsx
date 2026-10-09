'use client';
import Link from 'next/link';
import { useState } from 'react';
export default function Playground() {
  const [prompt, setPrompt] = useState('Explain how streaming AI responses work in one paragraph.');
  const [ran, setRan] = useState(false);
  return (
    <main className="shell" style={{ paddingTop: 48 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 28,
        }}
      >
        <div>
          <Link href="/" style={{ color: 'var(--muted)', fontSize: 13 }}>
            ← Home
          </Link>
          <h1
            style={{
              fontSize: 36,
              letterSpacing: '-.06em',
              margin: '22px 0 0',
            }}
          >
            Playground
          </h1>
        </div>
        <span
          className="mono"
          style={{
            fontSize: 11,
            color: 'var(--muted)',
            border: '1px solid var(--line)',
            padding: '7px 10px',
            borderRadius: 6,
          }}
        >
          DEMO MODE
        </span>
      </div>
      <div
        className="panel"
        style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
          minHeight: 590,
          overflow: 'hidden',
        }}
      >
        <aside style={{ borderRight: '1px solid var(--line)', padding: 18 }}>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>MODEL</span>
          <button
            type="button"
            className="panel"
            style={{
              width: '100%',
              marginTop: 10,
              padding: 12,
              textAlign: 'left',
              color: 'white',
            }}
          >
            OpenAI / GPT-4o <span style={{ float: 'right' }}>⌄</span>
          </button>
          <span
            style={{
              display: 'block',
              fontSize: 12,
              color: 'var(--muted)',
              marginTop: 28,
            }}
          >
            SETTINGS
          </span>
          {['Temperature 0.7', 'Max tokens 1024', 'Streaming on'].map(setting => (
            <div
              key={setting}
              style={{
                padding: '14px 0',
                borderBottom: '1px solid var(--line)',
                fontSize: 13,
                color: 'var(--muted)',
              }}
            >
              {setting}
            </div>
          ))}
        </aside>
        <section style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              padding: 20,
              borderBottom: '1px solid var(--line)',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>Prompt</span>
            <button
              type="button"
              onClick={() => setPrompt('')}
              style={{
                background: 'none',
                border: 0,
                color: 'var(--muted)',
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          </div>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            style={{
              flex: 1,
              minHeight: 180,
              resize: 'none',
              background: 'transparent',
              border: 0,
              outline: 0,
              color: 'white',
              padding: 22,
              lineHeight: 1.6,
            }}
            aria-label="Prompt"
          />
          <div
            style={{
              padding: 18,
              borderTop: '1px solid var(--line)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>{prompt.length} characters</span>
            <button
              type="button"
              onClick={() => setRan(true)}
              style={{
                background: '#f4f4f5',
                color: '#09090b',
                border: 0,
                borderRadius: 7,
                padding: '10px 16px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Run prompt ↗
            </button>
          </div>
          {ran && (
            <div
              style={{
                margin: 18,
                padding: 20,
                background: '#0b0d12',
                borderRadius: 10,
                lineHeight: 1.7,
                color: '#d4d4d8',
              }}
            >
              <span className="mono" style={{ fontSize: 11, color: 'var(--accent)' }}>
                RESPONSE · 1.2s
              </span>
              <p>
                Streaming lets an AI application show tokens as they are generated, rather than
                waiting for the complete response. This makes interfaces feel faster and gives users
                immediate feedback while the model continues working.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
