import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Gateway',
  description:
    'One API key for every model. Provider routing with spend tracking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
