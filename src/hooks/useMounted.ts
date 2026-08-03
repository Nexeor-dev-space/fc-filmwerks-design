'use client';

import { useEffect, useState } from 'react';

/**
 * False during SSR and the first client render, true afterwards. Use it to
 * defer browser-only markup (portals, viewport-dependent UI) past hydration.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted;
}
