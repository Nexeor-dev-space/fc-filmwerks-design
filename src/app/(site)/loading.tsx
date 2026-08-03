/**
 * Streamed while a route segment's data resolves. Deliberately minimal — a
 * heavy skeleton competes with the page it is about to be replaced by.
 */
export default function SiteLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] items-center justify-center"
    >
      <span className="sr-only">Loading</span>
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-foreground" />
    </div>
  );
}
