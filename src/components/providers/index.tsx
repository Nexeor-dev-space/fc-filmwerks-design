import type { ReactNode } from 'react';

import { SmoothScrollProvider } from './SmoothScrollProvider';

/**
 * Every app-wide provider composes here, so the root layout stays a single
 * wrapper. Add theme, analytics or query providers to this tree.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <SmoothScrollProvider>{children}</SmoothScrollProvider>;
}

export { SmoothScrollProvider };
