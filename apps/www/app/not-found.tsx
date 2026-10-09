import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-.04em] sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        The page you are looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/resources/recipes"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Browse recipes <ArrowUpRight className="size-4" />
      </Link>
    </div>
  );
}
