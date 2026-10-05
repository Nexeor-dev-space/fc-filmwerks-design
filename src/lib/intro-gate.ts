/** Marks the document as holding still while the opening sequence loads. */
export const INTRO_LOADING_ATTR = 'data-intro-loading';

/**
 * Longest the gate may hold on its own, before React has taken over.
 *
 * The attribute below is normally removed by `IntroExperience` as soon as it
 * mounts and decides whether there is anything to wait for. This is the
 * backstop for the case where that never happens — a bundle that fails to
 * load, a hydration error — because a page nobody can scroll is a far worse
 * outcome than a page that scrolled a moment too early.
 */
const RELEASE_MS = 12000;

/**
 * Runs as a blocking inline script at the top of the homepage.
 *
 * Neutralized for issue #53:
 * The hero section should not block the page behind a loading screen or lock
 * document scrolling while the video loads. Kept as a no-op string to satisfy
 * existing imports and scripts without setting the locking attribute.
 */
export const INTRO_GATE_SCRIPT = '';