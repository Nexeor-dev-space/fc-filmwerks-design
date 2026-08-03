import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

/* -------------------------------------------------------------------------- */
/* Navigation                                                                  */
/* -------------------------------------------------------------------------- */

export interface NavItem {
  label: string;
  href: string;
  /** Renders as an anchor with target="_blank" and a noopener rel. */
  external?: boolean;
  description?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

/* -------------------------------------------------------------------------- */
/* Component helpers                                                           */
/* -------------------------------------------------------------------------- */

/** Props for a component that renders `children` and accepts a className. */
export interface BaseProps {
  className?: string;
  children?: ReactNode;
}

/**
 * Polymorphic props — lets a component swap its rendered element via `as`
 * while keeping the native props of that element type-checked.
 */
export type PolymorphicProps<T extends ElementType, P = object> = P & {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof P | 'as'>;

/* -------------------------------------------------------------------------- */
/* Domain                                                                      */
/* -------------------------------------------------------------------------- */

export interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  noIndex?: boolean;
  keywords?: string[];
}

export interface MediaAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Low-quality placeholder for `next/image` blur-up. */
  blurDataURL?: string;
}

export interface VideoAsset {
  src: string;
  poster?: string;
  /** Vimeo/YouTube id when the video is hosted off-site. */
  externalId?: string;
}
