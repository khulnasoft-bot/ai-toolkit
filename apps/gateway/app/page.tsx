export default function HomePage() {
  return (
    <main
      style={{
        maxWidth: 720,
        margin: '64px auto',
        padding: '0 24px',
        lineHeight: 1.6,
      }}
    >
      <p
        style={{
          fontFamily: 'monospace',
          fontSize: 12,
          letterSpacing: '0.2em',
        }}
      >
        AI TOOLKIT
      </p>
      <h1>AI Gateway</h1>
      <p>One API key for every model. Provider routing with spend tracking.</p>
      <h2>Endpoints</h2>
      <ul>
        <li>
          <code>POST /v1/chat</code> — Bearer key, UIMessage stream (same shape
          as the playground <code>/api/chat</code>)
        </li>
        <li>
          <code>GET /v1/models</code> — public routing catalog
        </li>
      </ul>
      <h2>Quickstart</h2>
      <pre style={{ background: '#f4f4f5', padding: 16, overflowX: 'auto' }}>
        {`# 1. provider credentials
cp .env.example .env.local

# 2. create a key (secret is shown once)
pnpm keys:create --tenant acme

# 3. chat through the gateway
curl -N http://localhost:3000/v1/chat \\
  -H "Authorization: Bearer <secret>" \\
  -H 'Content-Type: application/json' \\
  -d '{"model":"openai/gpt-4o-mini","messages":[{"id":"1","role":"user","parts":[{"type":"text","text":"Hi"}]}]}'`}
      </pre>
      <p>
        Usage lands in <code>data/usage.jsonl</code> with per-call cost. Keys
        live in <code>data/keys.json</code> (hashed).
      </p>
    </main>
  );
}
