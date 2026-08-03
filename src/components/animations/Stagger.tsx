'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

import { STAGGER, VIEWPORT, fadeInUp, staggerContainer } from '@/constants';
import { cn } from '@/lib/utils';

interface StaggerProps {
  children: ReactNode;
  className?: string;
  /** Seconds between each child's entrance. */
  stagger?: number;
  delay?: number;
  repeat?: boolean;
}

/**
 * Cascades its `Stagger.Item` children into view. The parent owns the timing,
 * so items stay in document order and no child needs a hard-coded delay.
 *
 * ```tsx
 * <Stagger>
 *   {items.map((item) => (
 *     <Stagger.Item key={item.id}>{item.label}</Stagger.Item>
 *   ))}
 * </Stagger>
 * ```
 */
export function Stagger({
  children,
  className,
  stagger = STAGGER.base,
  delay = 0,
  repeat = false,
}: StaggerProps) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...VIEWPORT, once: !repeat }}
      variants={{
        ...staggerContainer,
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div className={cn(className)} variants={fadeInUp}>
      {children}
    </motion.div>
  );
}

Stagger.Item = StaggerItem;
