'use client';

import { useEffect } from 'react';

import './globals.css';

/**
 * Last-resort boundary for errors thrown by the root layout itself. It
 * replaces the whole document, so it must render its own <html> and <body>
 * and cannot rely on anything the root layout provides.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-dvh items-center justify-center p-6 antialiased">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Something went wrong
          </h1>
          <p className="mt-3 text-sm text-muted">
            The application failed to load. Please reload the page.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex h-11 items-center rounded-full bg-foreground px-6 text-sm font-medium text-background"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
