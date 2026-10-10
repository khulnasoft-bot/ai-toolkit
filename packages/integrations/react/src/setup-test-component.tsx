import { cleanup, render } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { createElement } from 'react';
import { afterEach, beforeEach, vi } from 'vitest';

export const setupTestComponent = (
  TestComponent: React.ComponentType<any>,
  {
    init,
  }: {
    init?: (TestComponent: React.ComponentType<any>) => React.ReactNode;
  } = {},
) => {
  beforeEach(() => {
    // reset SWR cache to isolate tests:
    render(
      createElement(
        SWRConfig,
        { value: { provider: () => new Map() } },
        init?.(TestComponent) ?? createElement(TestComponent),
      ),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });
};
