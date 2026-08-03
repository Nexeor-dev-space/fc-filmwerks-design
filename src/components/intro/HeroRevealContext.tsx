'use client';

import { createContext, useContext } from 'react';

/**
 * Whether the aperture has opened onto the hero yet.
 *
 * The hero is mounted underneath the intro from the first paint, so an
 * entrance animation keyed to mount would finish long before anyone sees it.
 * `IntroExperience` flips this as the blades reopen, and the hero holds its
 * entrance until then.
 *
 * Defaults to true so the hero animates normally wherever it is used on its
 * own, outside the intro.
 */
export const HeroRevealContext = createContext(true);

export function useHeroRevealed(): boolean {
  return useContext(HeroRevealContext);
}
