import Link from 'next/link';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';

import { cn } from '@/lib/utils';

/*
 * Navy carries the primary action; gold is reserved for the single most
 * important call to action on a page. If two gold buttons are visible at once,
 * one of them should be `outline`.
 */
const variants = {
  primary:
    'bg-foreground text-background hover:bg-foreground/90 focus-visible:outline-foreground',
  accent:
    'bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:outline-accent-foreground',
  secondary:
    'bg-surface text-foreground hover:bg-surface-muted focus-visible:outline-foreground',
  /* Border warms to gold on hover — the accent as a gesture, not a fill. */
  outline:
    'border border-border text-foreground hover:border-accent focus-visible:outline-foreground',
  ghost:
    'text-muted hover:text-foreground hover:bg-surface focus-visible:outline-foreground',
} as const;

const sizes = {
  sm: 'h-9 px-5 text-xs',
  md: 'h-11 px-7 text-xs',
  lg: 'h-13 px-9 text-sm',
} as const;

const base = cn(
  'inline-flex items-center justify-center gap-2 rounded-md',
  'font-medium tracking-[0.12em] uppercase',
  'transition-colors duration-300 ease-out',
  'focus-visible:outline-2 focus-visible:outline-offset-2',
  'disabled:pointer-events-none disabled:opacity-50',
);

interface ButtonBaseProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children?: ReactNode;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: never;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Renders a `<button>`, or a `next/link` when `href` is present — external
 * URLs fall through to a plain anchor with a safe `rel`.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if ('href' in props && props.href !== undefined) {
    const { href, ...anchorProps } = props;
    const isExternal =
      /^(https?:)?\/\//.test(href) || href.startsWith('mailto:');

    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          {...anchorProps}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const { href: _href, ...buttonProps } = props as ButtonAsButton;

  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
