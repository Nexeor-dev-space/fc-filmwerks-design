'use client';

import { motion, useMotionValue, type Variants } from 'framer-motion';
import { useCallback, useEffect, useRef } from 'react';

import { CtaButton } from '@/components/ui';
import {
  GOOGLE_REVIEWS_URL,
  reviews,
  type Review,
} from '@/config/testimonials';
import { EASE } from '@/constants';
import { usePrefersReducedMotion } from '@/hooks';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE.out, delay },
  }),
};

const AVATAR_PALETTES = [
  'bg-[#BFA76F]/15 text-[#BFA76F]',
  'bg-[#4285F4]/15 text-[#4285F4]',
  'bg-[#34A853]/15 text-[#34A853]',
  'bg-[#EA4335]/15 text-[#EA4335]',
  'bg-[#FBBC05]/15 text-[#FBBC05]',
  'bg-[#BFA76F]/15 text-[#BFA76F]',
  'bg-[#4285F4]/15 text-[#4285F4]',
  'bg-[#34A853]/15 text-[#34A853]',
];

function getInitials(name: string): string {
  const parts = name.split(' ');
  return parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : parts[0][0];
}

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-label="Google">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4 fill-[#BFA76F]">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const palette = AVATAR_PALETTES[index % AVATAR_PALETTES.length];

  return (
    <div
      className="review-float w-[85vw] shrink-0 sm:w-[72vw] md:w-[42vw] lg:w-[30vw] xl:w-[380px]"
      style={{ animationDelay: `${(index % reviews.length) * 0.6}s` }}
    >
      <div className="group relative rounded-[20px] border border-white/[0.06] bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-7 shadow-[0_4px_24px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-white/[0.12] hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] md:p-8 lg:p-9">
        {/* Google logo */}
        <GoogleLogo className="absolute top-7 right-7 h-5 w-5 md:top-8 md:right-8" />

        {/* Avatar + name + date */}
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[0.8125rem] font-semibold ${palette}`}
          >
            {getInitials(review.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[0.9375rem] font-medium text-white">
              {review.name}
            </p>
            <p className="text-[0.75rem] text-white/40">{review.date}</p>
          </div>
        </div>

        {/* Stars */}
        <div className="mt-4">
          <Stars />
        </div>

        {/* Quote with fade mask for overflow */}
        <div
          className="mt-4 max-h-[8.5rem] overflow-hidden md:max-h-[9.5rem]"
          style={{
            maskImage:
              'linear-gradient(to bottom, black 75%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, black 75%, transparent 100%)',
          }}
        >
          <p className="text-[0.875rem] leading-[1.75] text-white/70 md:text-[0.9375rem]">
            {review.quote}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Google Reviews presented as a premium auto-scrolling carousel.
 *
 * The track holds two copies of the review cards placed end to end. A
 * `requestAnimationFrame` loop decrements the track's `x` position — when it
 * passes one full set's width, it wraps back, producing a seamless infinite
 * scroll with no seam and no jump. Hovering pauses the loop; touch drag
 * overrides it on mobile, resuming autoplay on release.
 */
export function TestimonialsSection() {
  const reducedMotion = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const setWidthRef = useRef(0);
  const isPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const x = useMotionValue(0);

  // Measure width of one set of cards for seamless wrapping.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const children = track.children;
      if (children.length >= reviews.length * 2) {
        const el = children[reviews.length] as HTMLElement;
        setWidthRef.current = el.offsetLeft;
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  // Autoplay via rAF — GPU-friendly since Framer Motion's `x` writes a
  // compositor-only `transform`.
  useEffect(() => {
    if (reducedMotion) return;

    let frame: number;
    const speed = 0.5;

    const tick = () => {
      if (
        !isPausedRef.current &&
        !isDraggingRef.current &&
        setWidthRef.current > 0
      ) {
        let cur = x.get();
        cur -= speed;
        if (cur <= -setWidthRef.current) cur += setWidthRef.current;
        x.set(cur);
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion, x]);

  // Touch/pointer drag for mobile swipe.
  const dragState = useRef({ startX: 0, scrollX: 0 });

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDraggingRef.current = true;
      dragState.current = { startX: e.clientX, scrollX: x.get() };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [x],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      const delta = e.clientX - dragState.current.startX;
      let next = dragState.current.scrollX + delta;
      const sw = setWidthRef.current;
      if (sw > 0) {
        while (next > 0) next -= sw;
        while (next <= -sw) next += sw;
      }
      x.set(next);
    },
    [x],
  );

  const onPointerUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative overflow-hidden bg-[#0F1C2E] pt-16 pb-20 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28"
    >
      {/* Oversized outline word */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 text-[18vw] leading-none font-bold tracking-[-0.04em] whitespace-nowrap select-none"
        style={{
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.02)',
        }}
      >
        Stories
      </span>

      {/* Heading */}
      <div className="relative w-full px-4 md:px-[3vw]">
        <header className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-20">
          <div className="max-w-[760px]">
            <motion.p
              className="mb-5 text-[0.875rem] font-semibold tracking-[0.28em] text-[#BFA76F] uppercase"
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              Testimonials
            </motion.p>

            <motion.h2
              id="testimonials-heading"
              className="text-[2.625rem] leading-[0.95] font-semibold tracking-[-0.02em] text-white uppercase md:text-[3.375rem] lg:text-[4rem] xl:text-[4.5rem]"
              variants={fadeUp}
              custom={0.08}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              The stories
              <br />
              behind
              <br />
              the stories.
            </motion.h2>
          </div>

          <motion.p
            className="max-w-[500px] text-[1rem] leading-[1.8] text-white/[0.72] md:text-[1.0625rem] lg:shrink-0 lg:pt-4 lg:text-[1.125rem]"
            variants={fadeUp}
            custom={0.16}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
          >
            Every frame we create begins with trust. These reviews reflect the
            partnerships, creativity and dedication behind every project.
          </motion.p>
        </header>
      </div>

      {/* Carousel */}
      <motion.div
        className="relative mt-16 lg:mt-24"
        variants={fadeUp}
        custom={0.24}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div
          className="overflow-hidden"
          onMouseEnter={() => {
            isPausedRef.current = true;
          }}
          onMouseLeave={() => {
            isPausedRef.current = false;
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{ touchAction: 'pan-y', cursor: 'grab' }}
        >
          <motion.div
            ref={trackRef}
            className="flex gap-5 py-6 pl-4 md:gap-6 md:pl-[3vw] lg:gap-8"
            style={{ x }}
          >
            {[...reviews, ...reviews].map((review, i) => (
              <ReviewCard key={i} review={review} index={i} />
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="mt-16 flex justify-center px-4 md:px-[3vw] lg:mt-24"
        variants={fadeUp}
        custom={0}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
      >
        <CtaButton href={GOOGLE_REVIEWS_URL}>View more stories →</CtaButton>
      </motion.div>

      {/* Flat list for assistive technology and crawlers. */}
      <div className="sr-only">
        <ul>
          {reviews.map((review) => (
            <li key={review.name}>
              <p>
                {review.name} — {review.rating} stars — {review.date}
              </p>
              <blockquote>{review.quote}</blockquote>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
