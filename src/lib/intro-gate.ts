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
 * The opening is driven entirely by scroll position, so scrolling during the
 * wait spends the shot before it can be shown. `IntroExperience` holds the
 * page for exactly this reason, but it can only do so once React has
 * hydrated, and on a cold cache over a slow line that is seconds after the
 * markup has painted — measured at 3.2s throttled to 4 Mbps, which is three
 * seconds during which the reader sees the lens sitting at "Loading 0%" and
 * can scroll straight past it.
 *
 * Setting the attribute here closes that window: it applies before the intro
 * markup is even parsed, and the CSS rule keyed off it does the rest.
 *
 * Deliberately a script rather than a class in the server-rendered markup or a
 * `<style>` block. Both of those would hold the page for a visitor whose
 * JavaScript never arrives, and there would be nothing left running to release
 * it. A script that cannot run cannot lock anything, and the timeout covers
 * the case where it runs but React never follows.
 *
 * Kept as a string with no dependencies so it can be inlined verbatim, and
 * wrapped in try/catch because this must never be the thing that breaks the
 * page.
 */
export const INTRO_GATE_SCRIPT = `(function(){try{var h=document.documentElement;h.setAttribute('${INTRO_LOADING_ATTR}','true');setTimeout(function(){h.removeAttribute('${INTRO_LOADING_ATTR}')},${RELEASE_MS})}catch(e){}})()`;
