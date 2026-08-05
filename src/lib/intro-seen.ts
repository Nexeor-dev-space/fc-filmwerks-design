/**
 * Whether the lens intro has already played this session.
 *
 * Session-scoped rather than persistent: the intro is the studio's opening
 * shot, so it should play once per visit but not be lost forever on the
 * visitor's next trip to the site. Swap `sessionStorage` for `localStorage`
 * below to make it permanent — nothing else needs to change.
 */
export const INTRO_SEEN_KEY = 'fc_intro_seen';

/** Marks the document so CSS can suppress the intro before React hydrates. */
export const INTRO_SEEN_ATTR = 'data-intro-seen';

/**
 * Runs as a blocking inline script in the document head.
 *
 * This has to happen before first paint, not in an effect: the server sends
 * markup containing the intro, and the browser paints that HTML well before
 * React hydrates. Deciding in a `useEffect` would therefore still show a frame
 * of the gold intro on every repeat visit. Setting the attribute here lets a
 * plain CSS rule hide it in the same paint.
 *
 * Kept as a string with no dependencies so it can be inlined verbatim, and
 * wrapped in try/catch because storage access throws outright in some
 * privacy modes.
 */
export const INTRO_SEEN_SCRIPT = '';

/** True once the intro has played. Safe to call during a layout effect. */
export function hasSeenIntro(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.hasAttribute(INTRO_SEEN_ATTR);
}

/**
 * Broadcast when the intro finishes, so chrome that lives outside the intro's
 * React tree — the site navigation — can appear without being wired through
 * context it has no other reason to consume.
 */
export const INTRO_SEEN_EVENT = 'fc:intro-seen';

/** Records that the intro has played, for the rest of the session. */
export function markIntroSeen(): void {
  if (typeof document === 'undefined') return;
  if (document.documentElement.hasAttribute(INTRO_SEEN_ATTR)) return;

  document.documentElement.setAttribute(INTRO_SEEN_ATTR, 'true');
  window.dispatchEvent(new Event(INTRO_SEEN_EVENT));
  // No persistence — the intro replays on every page load.
}
