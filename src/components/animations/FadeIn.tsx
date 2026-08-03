'use client';

import { motion, type Variants } from 'framer-motion';
import { useMemo, type ElementType, type ReactNode } from 'react';

import { DURATION, EASE, VIEWPORT } from '@/constants';
import { cn } from '@/lib/utils';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 24 },
  down: { x: 0, y: -24 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
  none: { x: 0, y: 0 },
};

interface FadeInProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  /** Distance travelled, in pixels. */
  distance?: number;
  /** Animate every time it enters the viewport instead of only the first. */
  repeat?: boolean;
  as?: ElementType;
}

/**
 * Scroll-triggered fade for one-off elements. For a group that should cascade,
 * wrap them in `Stagger` instead of giving each child its own delay.
 *
 * Framer Motion honours `prefers-reduced-motion` at the transform level, so no
 * extra handling is needed here.
 */
export function FadeIn({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = DURATION.base,
  distance,
  repeat = false,
  as = 'div',
}: FadeInProps) {
  // Memoised: motion.create() returns a new component type on every call, and
  // a changing type would unmount and remount the children each render.
  const MotionComponent = useMemo(() => motion.create(as), [as]);
  const offset = offsets[direction];
  const scale = distance !== undefined ? distance / 24 : 1;

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: offset.x * scale,
      y: offset.y * scale,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, delay, ease: EASE.out },
    },
  };

  return (
    <MotionComponent
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...VIEWPORT, once: !repeat }}
      variants={variants}
    >
      {children}
    </MotionComponent>
  );
}
