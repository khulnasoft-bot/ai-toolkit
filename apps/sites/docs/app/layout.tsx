import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'AI Toolkit Docs — Documentation',
  description:
    'Documentation for AI Toolkit, a unified TypeScript AI engineering platform.',
};

const nav = [
  ['Home', '/'],
  ['Guides', '/guides'],
  ['API Reference', '/api'],
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header
          className="shell"
          style={{ borderBottom: '1px solid var(--line)' }}
        >
          <nav
            style={{
              height: 68,
              display: 'flex',
              alignItems: 'center',
              gap: 30,
            }}
          >
            <Link
              href="/"
              style={{ fontWeight: 700, letterSpacing: '-.04em', fontSize: 18 }}
            >
              ai<span style={{ color: 'var(--accent)' }}>-toolkit</span>
            </Link>
            <div
              style={{
                display: 'flex',
                gap: 22,
                color: 'var(--muted)',
                fontSize: 14,
                flex: 1,
              }}
            >
              {nav.map(([label, href]) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
            </div>
            <Link href="/" style={{ color: 'var(--muted)', fontSize: 14 }}>
              Website
            </Link>
            <a
              className="panel"
              href="https://github.com"
              style={{ padding: '9px 14px', fontSize: 13 }}
            >
              GitHub ↗
            </a>
          </nav>
        </header>
        <main className="shell" style={{ paddingTop: 40, paddingBottom: 80 }}>
          {children}
        </main>
        <footer
          className="shell"
          style={{
            borderTop: '1px solid var(--line)',
            paddingTop: 28,
            paddingBottom: 40,
            marginTop: 100,
            color: 'var(--muted)',
            fontSize: 13,
          }}
        >
          AI Toolkit · Open source infrastructure for intelligent applications.
        </footer>
      </body>
    </html>
  );
}
