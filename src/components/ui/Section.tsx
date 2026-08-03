import type { ElementType } from 'react';

import { cn } from '@/lib/utils';
import type { PolymorphicProps } from '@/types';

const spacing = {
  none: '',
  sm: 'py-12 md:py-16',
  md: 'py-16 md:py-24',
  lg: 'py-24 md:py-32',
  xl: 'py-32 md:py-44',
} as const;

interface SectionOwnProps {
  spacing?: keyof typeof spacing;
  /** Anchor target for in-page navigation. */
  id?: string;
}

/**
 * Vertical rhythm wrapper. Pair with `Container` for the horizontal axis:
 * `<Section><Container>…</Container></Section>`.
 */
export function Section<T extends ElementType = 'section'>({
  as,
  spacing: spacingKey = 'lg',
  className,
  children,
  ...props
}: PolymorphicProps<T, SectionOwnProps>) {
  const Component = as ?? 'section';

  return (
    <Component
      className={cn('relative w-full', spacing[spacingKey], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
