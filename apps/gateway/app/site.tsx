import Link from 'next/link';
import type { ReactNode } from 'react';

export const ink = '#171717';
export const muted = '#666';
export const line = '#eaeaea';
export const wash = '#fafafa';

export function Container({ children }: { children: ReactNode }) {
  return (
    <div style={{ maxWidth: 1024, margin: '0 auto', padding: '0 24px' }}>
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontFamily: 'monospace',
        fontSize: 12,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: muted,
        margin: '0 0 12px',
      }}
    >
      {children}
    </p>
  );
}

export function Code({
  children,
  label,
}: {
  children: string;
  label?: string;
}) {
  return (
    <div
      style={{
        border: `1px solid ${line}`,
        borderRadius: 8,
        overflow: 'hidden',
        background: '#0a0a0a',
      }}
    >
      {label && (
        <div
          style={{
            padding: '8px 16px',
            borderBottom: '1px solid #262626',
            color: '#a1a1aa',
            fontSize: 12,
            fontFamily: 'monospace',
          }}
        >
          {label}
        </div>
      )}
      <pre
        style={{
          margin: 0,
          padding: 16,
          overflowX: 'auto',
          color: '#ededed',
          fontSize: 13,
          lineHeight: 1.7,
        }}
      >
        {children}
      </pre>
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = 'primary',
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost';
}) {
  const primary = variant === 'primary';
  return (
    <Link
      href={href}
      style={{
        display: 'inline-block',
        padding: '10px 20px',
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 600,
        textDecoration: 'none',
        background: primary ? ink : 'transparent',
        color: primary ? '#fff' : ink,
        border: primary ? `1px solid ${ink}` : `1px solid ${line}`,
      }}
    >
      {children}
    </Link>
  );
}

export function Nav() {
  return (
    <header
      style={{
        borderBottom: `1px solid ${line}`,
        position: 'sticky',
        top: 0,
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(8px)',
        zIndex: 10,
      }}
    >
      <Container>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 60,
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: 'none',
              color: ink,
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}
          >
            AI Gateway
          </Link>
          <nav style={{ display: 'flex', gap: 20, fontSize: 14 }}>
            <Link
              href="/models"
              style={{ color: muted, textDecoration: 'none' }}
            >
              Models
            </Link>
            <Link
              href="https://github.com/khulnasoft/ai-toolkit/tree/main/examples/04-tools/playground"
              style={{ color: muted, textDecoration: 'none' }}
            >
              Playground
            </Link>
            <Link
              href="https://github.com/khulnasoft/ai-toolkit"
              style={{ color: muted, textDecoration: 'none' }}
            >
              GitHub
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}

export function Footer() {
  return (
    <footer
      style={{
        borderTop: `1px solid ${line}`,
        marginTop: 96,
        padding: '32px 0',
      }}
    >
      <Container>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 13,
            color: muted,
          }}
        >
          <span>AI Gateway — self-hosted, Apache-2.0</span>
          <span>
            <Link href="/models" style={{ color: muted, marginRight: 16 }}>
              Models
            </Link>
            <Link
              href="https://github.com/khulnasoft/ai-toolkit"
              style={{ color: muted }}
            >
              GitHub
            </Link>
          </span>
        </div>
      </Container>
    </footer>
  );
}

export function Feature({
  title,
  children,
  link,
}: {
  title: string;
  children: ReactNode;
  link?: { href: string; label: string };
}) {
  return (
    <div
      style={{
        border: `1px solid ${line}`,
        borderRadius: 8,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 17, letterSpacing: '-0.01em' }}>
        {title}
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: 14,
          lineHeight: 1.6,
          color: muted,
          flex: 1,
        }}
      >
        {children}
      </p>
      {link && (
        <Link
          href={link.href}
          style={{ fontSize: 14, fontWeight: 600, color: ink }}
        >
          {link.label} →
        </Link>
      )}
    </div>
  );
}
