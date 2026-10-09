import { Github, Sparkles } from 'lucide-react';

const columns = [
  {
    title: 'Explore',
    links: [
      { label: 'Recipes', href: '/resources/recipes' },
      { label: 'Tools Registry', href: '/resources/tools' },
      { label: 'Templates', href: '/resources/templates' },
      { label: 'Showcase', href: '/resources/showcase' },
      { label: 'Providers', href: '/providers' },
      { label: 'Gateways', href: '/gateways' },
      { label: 'Gateway Models', href: '/gateways/models' },
      { label: 'Playground', href: '/playground' },
    ],
  },
  {
    title: 'Documentation',
    links: [
      { label: 'AI Toolkit Core', href: 'https://studio.khulnasoft.com/docs' },
      {
        label: 'AI Toolkit UI',
        href: 'https://studio.khulnasoft.com/docs/ai-toolkit-ui',
      },
      {
        label: 'AI Toolkit RSC',
        href: 'https://studio.khulnasoft.com/docs/ai-toolkit-rsc',
      },
      {
        label: 'Providers',
        href: 'https://studio.khulnasoft.com/docs/ai-toolkit-providers',
      },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'GitHub', href: 'https://github.com/khulnasoft/ai-toolkit' },
      { label: 'Discord', href: 'https://discord.com/invite/a3VTVwXdEd' },
      { label: 'AI Gateway', href: 'https://vercel.com/ai-gateway' },
      { label: 'AI Elements', href: 'https://elements.ai-toolkit.dev/' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-alpha-border-strong">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Sparkles className="size-4" />
              </span>
              AI TOOLKIT
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
              The AI Toolkit for TypeScript and JavaScript. A unified layer for
              building AI apps and agents.
            </p>
            <a
              href="https://github.com/khulnasoft/ai-toolkit"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Github className="size-4" />
              github.com/khulnasoft/ai-toolkit
            </a>
          </div>
          {columns.map(column => (
            <div key={column.title}>
              <h3 className="font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={
                        link.href.startsWith('http') ? '_blank' : undefined
                      }
                      rel={
                        link.href.startsWith('http') ? 'noreferrer' : undefined
                      }
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-alpha-border pt-6 md:flex-row">
          <p className="text-sm text-muted-foreground">
            Open-source under the Apache-2.0 license.
          </p>
          <p className="text-sm text-muted-foreground">
            Built by the KhulnaSoft team · © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
