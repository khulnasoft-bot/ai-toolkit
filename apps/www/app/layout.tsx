import type { Metadata } from 'next';
import '@ai-toolkit/design/globals.css';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: {
    default: 'AI TOOLKIT',
    template: '%s · AI TOOLKIT',
  },
  description:
    'The AI Toolkit for TypeScript and JavaScript. Recipes, tools, templates, and community projects built with the AI SDK.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Nav />
        <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
