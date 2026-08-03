import type { ElementType } from 'react';

import { cn } from '@/lib/utils';
import type { PolymorphicProps } from '@/types';

const sizes = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[100rem]',
  /** The hero and its navigation share this measure. */
  wide: 'max-w-[1500px]',
  full: 'max-w-none',
} as const;

interface ContainerOwnProps {
  size?: keyof typeof sizes;
  /** Drop the horizontal padding for edge-to-edge media. */
  bleed?: boolean;
}

/**
 * The single place horizontal page rhythm is defined. Sections should not set
 * their own max-width or gutters — wrap content in a Container instead.
 */
export function Container<T extends ElementType = 'div'>({
  as,
  size = 'lg',
  bleed = false,
  className,
  children,
  ...props
}: PolymorphicProps<T, ContainerOwnProps>) {
  const Component = as ?? 'div';

  return (
    <Component
      className={cn(
        'mx-auto w-full',
        sizes[size],
        !bleed && 'px-5 sm:px-8 lg:px-12',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
