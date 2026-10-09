import Link from 'next/link';
import { loadPolicy, loadPrices } from '@/lib/config';
import { supportedProviders } from '@/lib/providers';
import {
  ButtonLink,
  Code,
  Container,
  Eyebrow,
  Feature,
  line,
  muted,
  wash,
} from './site';

const CURL = `curl -N http://localhost:3000/v1/chat \\
  -H "Authorization: Bearer ak_..." \\
  -H 'Content-Type: application/json' \\
  -d '{"model":"openai/gpt-4o-mini","messages":[{"id":"1","role":"user","parts":[{"type":"text","text":"Hi"}]}]}'`;

export default function HomePage() {
  const policy = loadPolicy();
  const prices = loadPrices();
  const priceFor = (pattern: string) =>
    prices.entries.find(entry => entry.modelPattern === pattern);

  return (
    <main>
      {/* Hero */}
      <Container>
        <div style={{ padding: '96px 0 64px', textAlign: 'center' }}>
          <Eyebrow>
            <span style={{ display: 'block', textAlign: 'center' }}>
              Self-hosted AI gateway
            </span>
          </Eyebrow>
          <h1
            style={{
              fontSize: 56,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              margin: '0 0 16px',
            }}
          >
            One API key.
            <br />
            Every model.
          </h1>
          <p
            style={{
              fontSize: 19,
              color: muted,
              maxWidth: 640,
              margin: '0 auto 32px',
            }}
          >
            Provider routing with automatic failover and per-call spend
            tracking. Your keys, your bill — no markup.
          </p>
          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              marginBottom: 48,
            }}
          >
            <ButtonLink href="#quickstart">Get started</ButtonLink>
            <ButtonLink href="/models" variant="ghost">
              Browse models
            </ButtonLink>
          </div>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'left' }}>
            <Code label="bash">{CURL}</Code>
          </div>
          <p style={{ fontSize: 13, color: muted, marginTop: 16 }}>
            {policy.routes.length} routes · {supportedProviders().length}{' '}
            providers · priced in {prices.currency}
          </p>
        </div>
      </Container>

      {/* Pricing */}
      <div style={{ borderTop: `1px solid ${line}`, background: wash }}>
        <Container>
          <div style={{ padding: '64px 0' }}>
            <Eyebrow>Pricing</Eyebrow>
            <h2
              style={{
                fontSize: 32,
                letterSpacing: '-0.03em',
                margin: '0 0 12px',
              }}
            >
              No markup, just provider prices.
            </h2>
            <p style={{ color: muted, maxWidth: 640, margin: '0 0 24px' }}>
              Every completed stream appends its token counts and cost to an
              append-only ledger. Unpriced models are flagged — never silently
              $0.
            </p>
            <Code label="data/usage.jsonl">
              {`{"tenant":"acme","model":"openai/gpt-4o-mini","provider":"openai",\n "promptTokens":18,"completionTokens":42,"cost":0.000028,"currency":"USD"}`}
            </Code>
          </div>
        </Container>
      </div>

      {/* Models preview */}
      <Container>
        <div style={{ padding: '64px 0' }}>
          <Eyebrow>Models</Eyebrow>
          <h2
            style={{
              fontSize: 32,
              letterSpacing: '-0.03em',
              margin: '0 0 12px',
            }}
          >
            Route on availability, cost, or latency.
          </h2>
          <p style={{ color: muted, maxWidth: 640, margin: '0 0 24px' }}>
            If a provider degrades, the gateway fails over to the next provider
            before the first chunk is streamed. Same model shape, no downtime.
          </p>
          <div
            style={{
              border: `1px solid ${line}`,
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 14,
              }}
            >
              <thead>
                <tr style={{ background: wash, textAlign: 'left' }}>
                  {['Model', 'Providers', 'In / 1k', 'Out / 1k'].map(h => (
                    <th
                      key={h}
                      style={{
                        padding: '12px 16px',
                        fontWeight: 600,
                        borderBottom: `1px solid ${line}`,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {policy.routes.slice(0, 5).map(route => {
                  const price = priceFor(route.modelPattern);
                  return (
                    <tr
                      key={route.modelPattern}
                      style={{ borderBottom: `1px solid ${line}` }}
                    >
                      <td
                        style={{
                          padding: '12px 16px',
                          fontFamily: 'monospace',
                          fontSize: 13,
                        }}
                      >
                        {route.modelPattern}
                      </td>
                      <td style={{ padding: '12px 16px', color: muted }}>
                        {route.providers.map(p => p.provider).join(' → ')}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {price ? `$${price.inputPer1k}` : 'unpriced'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {price ? `$${price.outputPer1k}` : 'unpriced'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 16 }}>
            <Link href="/models" style={{ fontWeight: 600, color: '#171717' }}>
              View all routes →
            </Link>
          </p>
        </div>
      </Container>

      {/* Features */}
      <div style={{ borderTop: `1px solid ${line}`, background: wash }}>
        <Container>
          <div style={{ padding: '64px 0' }}>
            <Eyebrow>Platform</Eyebrow>
            <h2
              style={{
                fontSize: 32,
                letterSpacing: '-0.03em',
                margin: '0 0 24px',
              }}
            >
              Routing, keys, and spend in one place.
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 16,
              }}
            >
              <Feature
                title="One key, every model"
                link={{ href: '#quickstart', label: 'Create a key' }}
              >
                Scrypt-hashed keys with scopes, expiry, and budget caps. Minted
                from the CLI, validated on every request — secrets are shown
                once and never stored.
              </Feature>
              <Feature
                title="Fallbacks that just work"
                link={{ href: '/models', label: 'See routing' }}
              >
                Ordered candidates with per-model retry budgets. Retryable
                failures (429s, 5xx, timeouts) move to the next provider;
                terminal errors surface immediately.
              </Feature>
              <Feature
                title="Spend you can audit"
                link={{ href: '/models', label: 'See pricing' }}
              >
                Token counts come from the provider, never the client. Costs
                land in a JSONL ledger keyed by tenant, key, model, and
                provider.
              </Feature>
            </div>
          </div>
        </Container>
      </div>

      {/* Migration */}
      <Container>
        <div style={{ padding: '64px 0' }}>
          <Eyebrow>Migration</Eyebrow>
          <h2
            style={{
              fontSize: 32,
              letterSpacing: '-0.03em',
              margin: '0 0 12px',
            }}
          >
            Swap N provider keys for one.
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 16,
              marginTop: 24,
            }}
          >
            <Code label="before: every SDK holds its own key">
              {`OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENERATIVE_AI_API_KEY=AI...`}
            </Code>
            <Code label="after: server-held keys, one client key">
              {`# server (.env.local)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# client (single header)
Authorization: Bearer ak_...`}
            </Code>
          </div>
          <p style={{ color: muted, marginTop: 16 }}>
            The playground already speaks this protocol — set{' '}
            <code>AI_GATEWAY_URL</code> and its chat traffic flows through your
            gateway with per-pane spend tracking.
          </p>
        </div>
      </Container>

      {/* Quickstart */}
      <div
        id="quickstart"
        style={{ borderTop: `1px solid ${line}`, background: wash }}
      >
        <Container>
          <div style={{ padding: '64px 0' }}>
            <Eyebrow>Quickstart</Eyebrow>
            <h2
              style={{
                fontSize: 32,
                letterSpacing: '-0.03em',
                margin: '0 0 24px',
              }}
            >
              Live in four commands.
            </h2>
            <Code label="bash">
              {`# 1. provider credentials (server-held, never shipped to clients)
cp .env.example .env.local

# 2. create a key (secret is shown once)
pnpm keys:create --tenant acme

# 3. run it
pnpm dev

# 4. chat through the gateway
curl -N http://localhost:3000/v1/chat \\
  -H "Authorization: Bearer <secret>" \\
  -H 'Content-Type: application/json' \\
  -d '{"model":"openai/gpt-4o-mini","messages":[]}'`}
            </Code>
          </div>
        </Container>
      </div>

      {/* Security */}
      <Container>
        <div style={{ padding: '64px 0' }}>
          <Eyebrow>Security</Eyebrow>
          <h2
            style={{
              fontSize: 32,
              letterSpacing: '-0.03em',
              margin: '0 0 24px',
            }}
          >
            Self-hosted means your data stays yours.
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 16,
            }}
          >
            <Feature title="Hashed credentials">
              API secrets exist only at creation time. The store holds salted
              scrypt hashes compared in constant time.
            </Feature>
            <Feature title="Scoped, expiring keys">
              Every key carries scopes, an optional budget cap, and an optional
              expiry. Revocation is one file write.
            </Feature>
            <Feature title="Local-first ledger">
              Keys and usage live in gitignored local files. Swap the file
              stores for a database behind the same interfaces for production.
            </Feature>
          </div>
        </div>
      </Container>

      {/* FAQ */}
      <div style={{ borderTop: `1px solid ${line}`, background: wash }}>
        <Container>
          <div style={{ padding: '64px 0', maxWidth: 720 }}>
            <Eyebrow>FAQ</Eyebrow>
            <h2
              style={{
                fontSize: 32,
                letterSpacing: '-0.03em',
                margin: '0 0 24px',
              }}
            >
              Frequently asked questions.
            </h2>
            {[
              [
                'How is this priced?',
                'It isn\u2019t — you pay your providers directly. The gateway adds no markup; the ledger shows exactly what each call cost.',
              ],
              [
                'Which models work?',
                'Whatever is in config/policy.json with server-held credentials. Today: OpenAI, Anthropic, Google, Groq, and Mistral. Adding a provider is one factory plus one policy entry.',
              ],
              [
                'What happens when a provider goes down?',
                'Retryable failures (429s, 5xx, timeouts) fail over to the next provider on the route before any chunk is streamed. Past the first chunk, errors stream to the client.',
              ],
              [
                'Where does usage data go?',
                'data/usage.jsonl — tenant, key, model, provider, tokens, and cost per completed stream. Query it with jq today, a database tomorrow.',
              ],
              [
                'Does it speak OpenAI-compatible protocols?',
                'Not yet. /v1/chat streams UIMessage SSE (the AI SDK / playground shape). OpenAI-compatible aliases are on the roadmap.',
              ],
            ].map(([q, a]) => (
              <div key={q} style={{ marginBottom: 20 }}>
                <p style={{ fontWeight: 700, margin: '0 0 4px' }}>{q}</p>
                <p style={{ color: muted, margin: 0, lineHeight: 1.6 }}>{a}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </main>
  );
}
