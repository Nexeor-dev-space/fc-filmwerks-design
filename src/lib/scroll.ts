import type Lenis from 'lenis';

/**
 * Bring an element to the top of the viewport, through Lenis when it is
 * mounted and natively when it is not.
 *
 * Why not `lenis.scrollTo(element)` directly: Lenis resolves an element
 * target against its own idea of the scroll position, and that lags a native
 * scroll that happened in the same task — a focus scroll before Enter on a
 * button, for one. The animation then starts from a stale value and lands
 * short. Resolving the target against `window.scrollY` ourselves, and telling
 * Lenis where the page actually is before asking it to move, removes both
 * failure modes. The intro does the same when it retires its wrapper.
 *
 * @param offset Space to leave above the element, in px.
 * @param immediate Jump rather than glide; for visitors who asked for reduced
 *   motion, where a scripted scroll is motion like any other.
 */
export function scrollToElement(
  element: HTMLElement,
  lenis: Lenis | undefined,
  offset = 96,
  { immediate = false }: { immediate?: boolean } = {},
) {
  const top = Math.max(
    0,
    element.getBoundingClientRect().top + window.scrollY - offset,
  );

  if (lenis) {
    lenis.scrollTo(window.scrollY, { immediate: true, force: true });
    lenis.scrollTo(top, { force: true, immediate });
    return;
  }

  window.scrollTo({ top, behavior: immediate ? 'auto' : 'smooth' });
}
