export default function Home() {
  return (
    <div>
      <h1
        style={{
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          letterSpacing: '-.05em',
          lineHeight: 1.1,
          marginBottom: 24,
        }}
      >
        AI Toolkit Documentation
      </h1>
      <p
        style={{
          color: 'var(--muted)',
          fontSize: 18,
          lineHeight: 1.6,
          maxWidth: 600,
          marginBottom: 40,
        }}
      >
        A unified TypeScript toolkit for building production AI applications.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <a
          href="/guides"
          style={{
            background: '#f4f4f5',
            color: '#09090b',
            borderRadius: 8,
            padding: '12px 17px',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Get Started
        </a>
        <a
          href="/api"
          className="panel"
          style={{ padding: '12px 17px', fontSize: 14 }}
        >
          API Reference
        </a>
      </div>
    </div>
  );
}
