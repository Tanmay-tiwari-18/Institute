import { useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
}

export default function AnimatedSection({ children, className = '', delay = 0, direction = 'up' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.4'],
  });

  const initialX = direction === 'left' ? -50 : direction === 'right' ? 50 : 0;
  const initialY = direction === 'up' ? 40 : 0;

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [initialY, 0]);
  const x = useTransform(scrollYProgress, [0, 1], [initialX, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, x }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
