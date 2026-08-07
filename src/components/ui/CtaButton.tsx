import type { ReactNode } from 'react';

import { Button } from './Button';
import { cn } from '@/lib/utils';

interface CtaButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
}

/**
 * The outlined route-through used at the end of homepage sections.
 *
 * A hairline that warms to gold and lifts a couple of pixels — the accent as a
 * gesture rather than a fill, which is what keeps gold reserved for emphasis
 * instead of turning it into a button colour. Shared so the several sections
 * that end this way cannot drift apart.
 */
export function CtaButton({ href, children, className }: CtaButtonProps) {
  return (
    <Button
      href={href}
      variant="outline"
      className={cn(
        'rounded-full border-white/70 text-white',
        'transition-[color,border-color,transform] duration-500 ease-out',
        'hover:-translate-y-0.5 hover:border-[#BFA76F] hover:text-[#BFA76F]',
        'focus-visible:outline-[#BFA76F]',
        'max-[340px]:h-8 max-[340px]:px-4 max-[340px]:text-[10px]',
        className,
      )}
    >
      {children}
    </Button>
  );
}
