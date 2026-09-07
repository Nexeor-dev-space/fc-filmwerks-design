'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { useIsTouchDevice, usePrefersReducedMotion } from '@/hooks';

type Mode = 'hidden' | 'idle' | 'link' | 'label';

/** Anything a pointer can act on tightens the ring. */
const INTERACTIVE =
  'a, button, [role="button"], [role="radio"], [role="tab"], label[for], summary, input, textarea, select';

/** What the disc says over an element that declares `data-cursor`. */
const LABELS: Record<string, string> = {
  view: 'View',
  play: 'Play',
  drag: 'Drag',
};

/** Ring diameter per state, in px. */
const SIZE: Record<Mode, number> = {
  hidden: 20,
  idle: 20,
  link: 44,
  label: 88,
};

/**
 * A ring that follows the pointer.
 *
 * The native cursor stays. Hiding it would take the I-beam out of every form
 * field and make precise clicks depend on a lagging follower, so this is a
 * companion rather than a replacement: a small ring a beat behind the arrow,
 * which tightens over anything clickable and opens into a labelled disc over
 * a card or a film frame, where the cards deliberately carry no "view"
 * text of their own. `mix-blend-difference` keeps it legible on any ground,
 * navy, bone or a bright still, without a colour per surface.
 *
 * Mouse only. Touch devices have no pointer to follow, and a visitor who has
 * asked for reduced motion gets no trailing element at all. Pointer moves
 * write straight to motion values, so following the mouse never re-renders;
 * only a change of state does.
 */
export function Cursor() {
  const touch = useIsTouchDevice();
  const reduced = usePrefersReducedMotion();
  const enabled = !touch && !reduced;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 600, damping: 45, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 600, damping: 45, mass: 0.4 });

  const [mode, setMode] = useState<Mode>('hidden');
  const [label, setLabel] = useState('');
  const [pressed, setPressed] = useState(false);
  const visible = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      x.set(event.clientX);
      y.set(event.clientY);
      if (!visible.current) {
        visible.current = true;
        setMode('idle');
      }
    };

    const over = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const target = event.target as Element | null;
      /* An iframe swallows the pointer, so the ring would freeze at its edge. */
      if (target?.tagName === 'IFRAME') {
        visible.current = false;
        setMode('hidden');
        return;
      }
      const labelled = target?.closest?.('[data-cursor]');
      if (labelled) {
        setLabel(LABELS[labelled.getAttribute('data-cursor') ?? ''] ?? '');
        setMode('label');
        return;
      }
      setMode(target?.closest?.(INTERACTIVE) ? 'link' : 'idle');
    };

    const leave = () => {
      visible.current = false;
      setMode('hidden');
    };
    const down = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') setPressed(true);
    };
    const up = () => setPressed(false);

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    document.addEventListener('pointerdown', down, { passive: true });
    document.addEventListener('pointerup', up, { passive: true });
    document.documentElement.addEventListener('mouseleave', leave);

    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.removeEventListener('pointerdown', down);
      document.removeEventListener('pointerup', up);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = SIZE[mode];

  return (
    /* Outer element carries the follow; inner carries size and centring. Two
       transforms, two elements, as everywhere else on the site. */
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[200] mix-blend-difference"
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full border border-[#F8F7F4] font-mono text-[0.625rem] tracking-[0.24em] text-[#0A131F] uppercase"
        initial={false}
        animate={{
          x: '-50%',
          y: '-50%',
          width: size,
          height: size,
          opacity: mode === 'hidden' ? 0 : 1,
          scale: pressed ? 0.85 : 1,
          backgroundColor:
            mode === 'label' ? 'rgba(248,247,244,1)' : 'rgba(248,247,244,0)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.6 }}
      >
        <motion.span
          initial={false}
          animate={{ opacity: mode === 'label' ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
