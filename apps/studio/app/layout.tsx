import type { Metadata } from 'next';
import '@ai-toolkit/design/globals.css';
import { StudioShell } from '@/components/studio-shell';
import { getSearchIndex } from '@/lib/search';

export const metadata: Metadata = {
  title: {
    default: 'AI Studio',
    template: '%s · AI Studio',
  },
  description:
    'Dashboard for the AI Toolkit — gateways, models, providers, tools, and templates.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <StudioShell items={getSearchIndex()}>{children}</StudioShell>
      </body>
    </html>
  );
}
