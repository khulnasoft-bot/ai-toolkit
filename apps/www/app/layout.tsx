import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'AI Toolkit — Build AI applications',
  description: 'A unified toolkit for building AI-powered applications.',
};

const nav = [
  ['Playground', '/playground'],
  ['Providers', '/providers'],
  ['Resources', '/resources/recipes'],
];
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="shell" style={{ borderBottom: '1px solid var(--line)' }}>
          <nav
            style={{
              height: 68,
              display: 'flex',
              alignItems: 'center',
              gap: 30,
            }}
          >
            <Link href="/" style={{ fontWeight: 700, letterSpacing: '-.04em', fontSize: 18 }}>
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
            <Link href="/docs" style={{ color: 'var(--muted)', fontSize: 14 }}>
              Docs
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
        {children}
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
