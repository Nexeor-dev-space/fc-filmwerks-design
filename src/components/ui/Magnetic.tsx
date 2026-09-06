'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, type ReactNode } from 'react';

import { useIsTouchDevice, usePrefersReducedMotion } from '@/hooks';
import { cn } from '@/lib/utils';

interface MagneticProps {
  children: ReactNode;
  /** Share of the pointer's offset from centre that the control follows. */
  strength?: number;
  /** How far outside the control's box the pull begins, in px. */
  reach?: number;
  className?: string;
}

/**
 * A control that leans toward the pointer.
 *
 * Within `reach` of its box the wrapper shifts a fraction of the way toward
 * the cursor and springs back when the pointer leaves, so a button meets a
 * hand halfway rather than waiting to be hit. Kept to controls that are on
 * screen for the whole visit, the header's two, because the effect is a
 * garnish and a page of leaning buttons reads as a toy.
 *
 * The wrapper owns the transform; whatever it wraps keeps its own hover
 * treatment untouched. Mouse only, and nothing at all under reduced motion,
 * where the wrapper is a plain inline box.
 */
export function Magnetic({
  children,
  strength = 0.3,
  reach = 40,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const touch = useIsTouchDevice();
  const reduced = usePrefersReducedMotion();
  const enabled = !touch && !reduced;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;
    const element = ref.current;
    if (!element) return;

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = element.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const near =
        Math.abs(dx) < rect.width / 2 + reach &&
        Math.abs(dy) < rect.height / 2 + reach;
      x.set(near ? dx * strength : 0);
      y.set(near ? dy * strength : 0);
    };

    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      x.set(0);
      y.set(0);
    };
  }, [enabled, reach, strength, x, y]);

  return (
    <motion.div
      ref={ref}
      className={cn('inline-flex', className)}
      style={enabled ? { x: springX, y: springY } : undefined}
    >
      {children}
    </motion.div>
  );
}
