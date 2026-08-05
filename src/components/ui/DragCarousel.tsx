'use client';

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';

import { usePrefersReducedMotion } from '@/hooks';
import { cn } from '@/lib/utils';

interface DragCarouselProps {
  children: ReactNode;
  /** Names the scrollable region for assistive technology. */
  label: string;
  /**
   * Gutter applied inside the scroller. Match the page padding so the first
   * item lines up with the heading above while items still bleed off the edge.
   */
  edgeClassName?: string;
  className?: string;
}

/** Past this, the gesture was a drag and the click that follows is discarded. */
const DRAG_THRESHOLD = 6;

/**
 * Horizontally scrollable strip with pointer dragging, inertia and a floating
 * "drag" cursor.
 *
 * Built on a real `overflow-x` scroller rather than a transformed track, which
 * is what gets native trackpad and horizontal-wheel gestures, momentum on
 * touch, keyboard arrow scrolling and correct `scrollIntoView` on focus for
 * free. The pointer handlers only add mouse dragging on top of that.
 *
 * The scroller is focusable so the strip can be reached and driven from the
 * keyboard; without `tabIndex` a mouse would be the only way to see past the
 * first few items.
 */
export function DragCarousel({
  children,
  label,
  edgeClassName,
  className,
}: DragCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const [dragging, setDragging] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [finePointer, setFinePointer] = useState(false);

  // Raw pointer position, then softened — a cursor that tracks exactly reads
  // as jittery next to the easing everywhere else on the page.
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const smoothX = useSpring(cursorX, {
    stiffness: 500,
    damping: 40,
    mass: 0.4,
  });
  const smoothY = useSpring(cursorY, {
    stiffness: 500,
    damping: 40,
    mass: 0.4,
  });

  const gesture = useRef({ active: false, lastX: 0, moved: 0 });
  const velocity = useRef(0);
  const glideFrame = useRef<number | null>(null);

  // Touch and stylus keep their native behaviour; the custom cursor and mouse
  // dragging are strictly a fine-pointer affordance.
  useEffect(() => {
    const query = window.matchMedia('(pointer: fine)');
    const sync = () => setFinePointer(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const stopGlide = useCallback(() => {
    if (glideFrame.current !== null) {
      cancelAnimationFrame(glideFrame.current);
      glideFrame.current = null;
    }
  }, []);

  useEffect(() => stopGlide, [stopGlide]);

  /** Decays the release velocity so a flick coasts instead of stopping dead. */
  const glide = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    velocity.current *= 0.94;
    el.scrollLeft -= velocity.current;

    if (Math.abs(velocity.current) > 0.4) {
      glideFrame.current = requestAnimationFrame(glide);
    } else {
      glideFrame.current = null;
    }
  }, []);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!finePointer || event.button !== 0) return;

    stopGlide();
    gesture.current = { active: true, lastX: event.clientX, moved: 0 };
    velocity.current = 0;
    setDragging(true);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (finePointer) {
      const bounds = event.currentTarget.getBoundingClientRect();
      cursorX.set(event.clientX - bounds.left);
      cursorY.set(event.clientY - bounds.top);
    }

    if (!gesture.current.active) return;
    const el = scrollerRef.current;
    if (!el) return;

    const delta = event.clientX - gesture.current.lastX;
    gesture.current.lastX = event.clientX;
    gesture.current.moved += Math.abs(delta);
    velocity.current = delta;
    el.scrollLeft -= delta;
  };

  const endDrag = () => {
    if (!gesture.current.active) return;
    gesture.current.active = false;
    setDragging(false);
    if (Math.abs(velocity.current) > 1) glide();
  };

  /*
   * A drag that finishes over a card would otherwise navigate. Capturing the
   * click lets it be swallowed before the link ever sees it, while a genuine
   * click — which never accumulates movement — passes straight through.
   */
  const onClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (gesture.current.moved > DRAG_THRESHOLD) {
      event.preventDefault();
      event.stopPropagation();
      gesture.current.moved = 0;
    }
  };

  const showCursor = finePointer && cursorVisible;

  return (
    <div
      className={cn('relative', className)}
      onPointerEnter={() => setCursorVisible(true)}
      onPointerLeave={() => {
        setCursorVisible(false);
        endDrag();
      }}
    >
      <div
        ref={scrollerRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        className={cn(
          // Snapping belongs on the scroll container itself. Phones get one
          // card at a time; from `md` up, free scrolling suits a wider strip.
          'snap-x snap-mandatory overflow-x-auto overscroll-x-contain md:snap-none',
          // No scrollbar, but still a real scroll container.
          '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
          'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F]',
          finePointer && (dragging ? 'cursor-grabbing' : 'cursor-none'),
          edgeClassName,
        )}
      >
        {children}
      </div>

      <AnimatePresence>
        {showCursor && !reducedMotion && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 z-20 hidden md:block"
            style={{ x: smoothX, y: smoothY }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-white px-5 py-3 text-[0.625rem] font-semibold tracking-[0.3em] text-[#0F1C2E] uppercase shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              <span>←</span>
              Drag
              <span>→</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
