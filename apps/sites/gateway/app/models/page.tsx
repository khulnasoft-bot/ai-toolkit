import { loadCatalog } from '@/lib/catalog';
import { Code, Container, Eyebrow, muted } from '../site';
import { ModelsBrowser } from './browser';

export const metadata = {
  title: 'Models — AI Gateway',
  description:
    'Browse every model: search, filter by provider and capability, compare prices.',
};

export default function ModelsPage() {
  const catalog = loadCatalog();

  return (
    <main>
      <Container>
        <div style={{ padding: '64px 0' }}>
          <Eyebrow>Live catalog · {catalog.length} models</Eyebrow>
          <h1
            style={{
              fontSize: 44,
              letterSpacing: '-0.03em',
              margin: '0 0 12px',
            }}
          >
            Browse models
          </h1>
          <p style={{ color: muted, maxWidth: 640, margin: '0 0 32px' }}>
            Served live from this gateway&apos;s <code>config/models.json</code>
            , <code>config/policy.json</code>, and{' '}
            <code>config/prices.json</code> — what you see is what routes. Click
            a row for failover order and copyable snippets.
          </p>
          <ModelsBrowser models={catalog} />
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
