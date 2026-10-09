import { loadPolicy, loadPrices } from '@/lib/config';
import { Code, Container, Eyebrow, line, muted } from '../site';

export const metadata = {
  title: 'Models — AI Gateway',
  description:
    'Live routing catalog: models, providers, retry budgets, and prices.',
};

export default function ModelsPage() {
  const policy = loadPolicy();
  const prices = loadPrices();
  const priceFor = (pattern: string) =>
    prices.entries.find(entry => entry.modelPattern === pattern);

  return (
    <main>
      <Container>
        <div style={{ padding: '64px 0' }}>
          <Eyebrow>Live catalog</Eyebrow>
          <h1
            style={{
              fontSize: 44,
              letterSpacing: '-0.03em',
              margin: '0 0 12px',
            }}
          >
            Models
          </h1>
          <p style={{ color: muted, maxWidth: 640, margin: '0 0 32px' }}>
            Served live from this gateway&apos;s <code>config/policy.json</code>{' '}
            and <code>config/prices.json</code> — what you see is what routes.
            Prices in {prices.currency} per 1k tokens.
          </p>
          <div
            style={{
              border: `1px solid ${line}`,
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: 14,
                  minWidth: 720,
                }}
              >
                <thead>
                  <tr style={{ background: '#fafafa', textAlign: 'left' }}>
                    {[
                      'Model pattern',
                      'Providers (failover order)',
                      'Strategy',
                      'Budget',
                      'In / 1k',
                      'Out / 1k',
                    ].map(h => (
                      <th
                        key={h}
                        style={{
                          padding: '12px 16px',
                          fontWeight: 600,
                          borderBottom: `1px solid ${line}`,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {policy.routes.map(route => {
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
                          {route.providers
                            .map(p => `${p.provider}/${p.model}`)
                            .join('  →  ')}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {route.strategy ?? 'ordered'}
                        </td>
                        <td
                          style={{
                            padding: '12px 16px',
                            fontFamily: 'monospace',
                          }}
                        >
                          {route.retryBudget}
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
          </div>
          {policy.fallback && (
            <p style={{ color: muted, marginTop: 16 }}>
              Fallback for unmatched models:{' '}
              <code>
                {policy.fallback.provider}/{policy.fallback.model}
              </code>
            </p>
          )}
          <div style={{ marginTop: 32 }}>
            <Code label="GET /v1/models">
              {`curl http://localhost:3000/v1/models`}
            </Code>
          </div>
        </div>
      </Container>
    </main>
  );
}
