'use client';

import { motion, type Variants } from 'framer-motion';

import { EASE } from '@/constants';
import { cn } from '@/lib/utils';

export interface EditorialRow {
  /** Zero-padded display number. */
  number: string;
  title: string;
  body: string;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE.out } },
};

/** Row children arrive together, a beat after the row's own divider. */
const rowGroup: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const drawLine: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.9, ease: EASE.out } },
};

interface EditorialRowsProps {
  items: EditorialRow[];
  /** Overrides the statement size — manifesto rows run larger than highlights. */
  titleClassName?: string;
  className?: string;
}

/**
 * Numbered statements as rows rather than cards.
 *
 * Three columns on a 12-track grid — number, statement, supporting line — with
 * a hairline above each. Nothing has a background or border box; the rhythm
 * comes entirely from the grid and the space around it.
 *
 * The dividers animate `scaleX` from `origin-left` rather than animating width,
 * which keeps them on the compositor and makes them wipe in from the left
 * instead of growing out from the middle.
 *
 * Hover is CSS on a `group`, so all three columns and the rule respond together
 * without any per-row state or re-render.
 */
export function EditorialRows({
  items,
  titleClassName,
  className,
}: EditorialRowsProps) {
  return (
    <ul className={className}>
      {items.map((item, index) => (
        <motion.li
          key={item.number}
          className="group"
          variants={rowGroup}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.div
            aria-hidden="true"
            className="h-px origin-left bg-white/[0.12] transition-colors duration-500 ease-out group-hover:bg-[#BFA76F]/50"
            variants={drawLine}
          />

          <div className="grid grid-cols-1 gap-6 py-10 md:py-12 lg:grid-cols-12 lg:items-baseline lg:gap-10 lg:py-16">
            <motion.span
              className="text-[0.875rem] tracking-[0.28em] text-white/35 transition-colors duration-500 ease-out group-hover:text-[#BFA76F] lg:col-span-1"
              variants={fadeUp}
            >
              {item.number}
            </motion.span>

            <motion.h3
              className={cn(
                'font-extralight tracking-[-0.01em] text-white/85 transition-colors duration-500 ease-out group-hover:text-white lg:col-span-6',
                titleClassName ??
                  'text-[1.75rem] leading-[1.05] md:text-[2.25rem] lg:text-[2.75rem]',
              )}
              variants={fadeUp}
            >
              {item.title}
            </motion.h3>

            <motion.p
              className="max-w-[440px] text-[1rem] leading-[1.8] text-white/[0.6] transition-colors duration-500 ease-out group-hover:text-white/75 lg:col-span-4 lg:col-start-9"
              variants={fadeUp}
            >
              {item.body}
            </motion.p>
          </div>

          {/* The last row needs a rule underneath it too, or the set reads as
              unfinished. */}
          {index === items.length - 1 && (
            <motion.div
              aria-hidden="true"
              className="h-px origin-left bg-white/[0.12]"
              variants={drawLine}
            />
          )}
        </motion.li>
      ))}
    </ul>
  );
}
