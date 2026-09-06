import type { ReactNode } from 'react';

import { RouteTransitionProvider } from '@/components/transition';

import { SmoothScrollProvider } from './SmoothScrollProvider';

/**
 * Every app-wide provider composes here, so the root layout stays a single
 * wrapper. Add theme, analytics or query providers to this tree.
 *
 * The route transition sits inside smooth scrolling so its overlay is part of
 * the same tree Lenis manages, and outside every page so it survives the
 * navigation it covers.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <SmoothScrollProvider>
      <RouteTransitionProvider>{children}</RouteTransitionProvider>
    </SmoothScrollProvider>
  );
}

export { SmoothScrollProvider };
