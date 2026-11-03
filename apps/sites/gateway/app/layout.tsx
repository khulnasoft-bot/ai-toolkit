import type { Metadata } from 'next';
import { Footer, Nav } from './site';

export const metadata: Metadata = {
  title: 'AI Gateway — One API key. Every model.',
  description:
    'Self-hosted AI gateway: provider routing with automatic failover and per-call spend tracking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          margin: 0,
          color: '#171717',
          background: '#fff',
        }}
      >
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
