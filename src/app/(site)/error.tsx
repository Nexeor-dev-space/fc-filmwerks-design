'use client';

import { useEffect } from 'react';

import { Button, Container, Section } from '@/components/ui';

/**
 * Catches render and data errors within the site route group. The root layout
 * (and therefore the header and footer) stays mounted.
 */
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Swap for the real error reporter once one is wired up.
    console.error(error);
  }, [error]);

  return (
    <Section spacing="xl">
      <Container size="sm">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Something went wrong
        </h1>
        <p className="mt-4 text-muted">
          An unexpected error interrupted this page. Try again, and if it keeps
          happening let us know.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-muted">
            Reference: {error.digest}
          </p>
        )}
        <div className="mt-8 flex gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button href="/" variant="outline">
            Back home
          </Button>
        </div>
      </Container>
    </Section>
  );
}
