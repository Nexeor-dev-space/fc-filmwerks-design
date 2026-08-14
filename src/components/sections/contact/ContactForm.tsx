'use client';

import { motion, type Variants } from 'framer-motion';
import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui';
import { contactForm } from '@/config/contact';
import { EASE } from '@/constants';
import { usePrefersReducedMotion } from '@/hooks';
import { cn } from '@/lib/utils';

interface Cue {
  index?: number;
  delay?: number;
  still: boolean;
}

const lineReveal: Variants = {
  hidden: ({ still }: Cue) => ({ y: still ? '0%' : '110%' }),
  visible: ({ index = 0, still }: Cue) => ({
    y: '0%',
    transition: still
      ? { duration: 0, delay: index * 0.08 }
      : { duration: 1.05, ease: EASE.expo, delay: index * 0.08 },
  }),
};

const fadeUp: Variants = {
  hidden: ({ still }: Cue) => ({ opacity: 0, y: still ? 0 : 24 }),
  visible: ({ delay = 0, still }: Cue) => ({
    opacity: 1,
    y: 0,
    transition: still
      ? { duration: 0.4, ease: EASE.out, delay, y: { duration: 0 } }
      : { duration: 0.8, ease: EASE.expo, delay },
  }),
};

/** Parent that cascades a stagger onto the field rows below it. */
const fieldGroup: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const inputClasses = cn(
  'w-full border-b border-white/[0.16] bg-transparent px-0 py-3 text-[1rem] text-white',
  'placeholder:text-white/30',
  'transition-colors duration-500 ease-out',
  'outline-none focus:border-[#BFA76F]',
);

/**
 * Each field is wrapped in a `group`, and the label brightens from the
 * wrapper's `:focus-within` rather than from the input's `:focus`.
 *
 * Deliberately not `peer-focus:` — that compiles to a `~` sibling selector,
 * which only reaches elements *after* the peer, and the label is rendered
 * before its input. The gold would silently never appear.
 */
const fieldClasses = 'group';

const labelClasses =
  'mb-2 block text-[0.6875rem] font-semibold tracking-[0.28em] text-white/40 uppercase transition-colors duration-500 ease-out group-focus-within:text-[#BFA76F]';

type Status = 'idle' | 'submitting' | 'success' | 'error';

/**
 * The existing four-field enquiry form, redesigned as editorial fields set
 * directly into the page rather than inside a card. Fields reveal as a
 * cascade, and the underline brightens to gold on focus — the same accent
 * treatment the contact links use elsewhere on this page.
 */
export function ContactForm() {
  const reducedMotion = usePrefersReducedMotion();
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Request failed');

      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <section
      id="contact-form"
      aria-labelledby="contact-form-heading"
      className="bg-[#0F1C2E] pt-20 pb-24 md:pt-28 md:pb-32 lg:pt-32 lg:pb-36"
    >
      <div className="w-full px-4 md:px-[3vw]">
        <div className="flex flex-col gap-14 lg:flex-row lg:items-start lg:gap-24">
          <div className="lg:w-[36%] lg:shrink-0">
            <motion.p
              className="mb-6 text-[0.875rem] font-semibold tracking-[0.28em] text-[#BFA76F] uppercase"
              variants={fadeUp}
              custom={{ delay: 0, still: reducedMotion }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              {contactForm.label}
            </motion.p>

            <motion.h2
              id="contact-form-heading"
              className="text-[2.5rem] leading-[0.95] font-semibold tracking-[-0.02em] text-white uppercase md:text-[3rem] lg:text-[3.5rem]"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              {contactForm.heading.map((line, index) => (
                <span key={line} className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    className="block"
                    variants={lineReveal}
                    custom={{ index, still: reducedMotion }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </motion.h2>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            noValidate
            className="flex-1"
            variants={fieldGroup}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
              <motion.div
                className={fieldClasses}
                variants={fadeUp}
                custom={{ still: reducedMotion }}
              >
                <label htmlFor="firstName" className={labelClasses}>
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Jane"
                  required
                  className={inputClasses}
                />
              </motion.div>

              <motion.div
                className={fieldClasses}
                variants={fadeUp}
                custom={{ still: reducedMotion }}
              >
                <label htmlFor="lastName" className={labelClasses}>
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Doe"
                  required
                  className={inputClasses}
                />
              </motion.div>

              <motion.div
                className={cn(fieldClasses, 'sm:col-span-2')}
                variants={fadeUp}
                custom={{ still: reducedMotion }}
              >
                <label htmlFor="email" className={labelClasses}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="jane@studio.com"
                  required
                  className={inputClasses}
                />
              </motion.div>

              <motion.div
                className={cn(fieldClasses, 'sm:col-span-2')}
                variants={fadeUp}
                custom={{ still: reducedMotion }}
              >
                <label htmlFor="message" className={labelClasses}>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us about your project…"
                  required
                  className={cn(inputClasses, 'resize-none')}
                />
              </motion.div>
            </div>

            <motion.div
              className="mt-12 flex flex-wrap items-center gap-6"
              variants={fadeUp}
              custom={{ still: reducedMotion }}
            >
              <Button
                type="submit"
                variant="accent"
                size="lg"
                disabled={status === 'submitting'}
                className="group rounded-full bg-[#BFA76F] text-[#0F1012] transition-[background-color,transform,box-shadow] duration-500 ease-out hover:-translate-y-0.5 hover:bg-[#d4bd82] hover:shadow-[0_8px_30px_rgba(191,167,111,0.2)]"
              >
                {status === 'submitting' ? 'Sending…' : 'Send'}
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1"
                >
                  →
                </span>
              </Button>

              <p
                role="status"
                aria-live="polite"
                className="text-[0.875rem] text-white/60"
              >
                {status === 'success' &&
                  'Thank you — we’ll be in touch shortly.'}
                {status === 'error' &&
                  'Something went wrong. Please try again, or email us directly.'}
              </p>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
