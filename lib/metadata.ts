import { Metadata } from 'next'

export const baseMetadata: Metadata = {
  title: 'AI Toolkit | Khulnasoft',
  description: 'Comprehensive open-source AI toolkit for building AI-powered applications',
  keywords: ['AI', 'Toolkit', 'LLM', 'OpenAI', 'Anthropic', 'TypeScript'],
  authors: [{ name: 'Khulnasoft' }],
  creator: 'Khulnasoft',
  publisher: 'Khulnasoft',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai-toolkit.example.com',
    siteName: 'AI Toolkit',
    title: 'AI Toolkit | Build AI-Powered Applications',
    description: 'Explore and experiment with the most comprehensive open-source AI toolkit',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Toolkit',
    description: 'Build AI-powered applications with ease',
  },
}

export function createPageMetadata(title: string, description: string): Metadata {
  return {
    ...baseMetadata,
    title: `${title} | AI Toolkit`,
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${title} | AI Toolkit`,
      description,
      type: 'website',
    },
  }
}
