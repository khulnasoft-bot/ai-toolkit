import Link from 'next/link';
import {
  providers,
  recipes,
  tools,
  showcase,
  type CatalogItem,
} from '@/lib/registry';
const data: Record<string, CatalogItem[]> = {
  providers,
  recipes,
  tools,
  showcase,
};
export function generateStaticParams() {
  return Object.keys(data).map(section => ({ section }));
}
export default async function Directory({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const items = data[section] ?? [];
  const title =
    section === 'showcase'
      ? 'Showcase'
      : section === 'tools'
        ? 'Tools Registry'
        : section[0].toUpperCase() + section.slice(1);
  return (
    <main className="shell" style={{ paddingTop: 70 }}>
      <Link href="/" style={{ color: 'var(--muted)', fontSize: 13 }}>
        ← Back home
      </Link>
      <div style={{ maxWidth: 700, margin: '55px 0 35px' }}>
        <p className="mono" style={{ color: 'var(--accent)', fontSize: 12 }}>
          CATALOG / {section.toUpperCase()}
        </p>
        <h1 style={{ fontSize: 56, letterSpacing: '-.07em', margin: '12px 0' }}>
          {title}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 17 }}>
          Discover the building blocks and ideas behind modern AI applications.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <input
          aria-label="Search catalog"
          placeholder="Search catalog..."
          style={{
            background: 'var(--panel)',
            border: '1px solid var(--line)',
            borderRadius: 8,
            padding: '12px 14px',
            color: 'white',
            width: 280,
          }}
        />
        <button
          style={{
            background: 'var(--accent-soft)',
            border: '1px solid #45347b',
            color: '#cfc3ff',
            borderRadius: 8,
            padding: '0 14px',
          }}
        >
          All categories
        </button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
          gap: 14,
        }}
      >
        {items.map(item => (
          <Link
            key={item.id}
            href={`/resources/${item.id}`}
            className="panel"
            style={{
              padding: 22,
              minHeight: 190,
              display: 'flex',
              flexDirection: 'column',
              gap: 15,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ fontSize: 17 }}>{item.name}</strong>
              <span style={{ color: 'var(--muted)' }}>↗</span>
            </div>
            <p
              style={{
                color: 'var(--muted)',
                lineHeight: 1.55,
                margin: 0,
                fontSize: 14,
              }}
            >
              {item.description}
            </p>
            <div
              style={{
                marginTop: 'auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', gap: 6 }}>
                {item.tags.map(tag => (
                  <span
                    key={tag}
                    style={{ fontSize: 11, color: 'var(--muted)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span
                className="mono"
                style={{ fontSize: 11, color: 'var(--muted)' }}
              >
                {item.meta}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
