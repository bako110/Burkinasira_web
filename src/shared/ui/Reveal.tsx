import { type ReactNode } from 'react';
import clsx from 'clsx';

import { useInView } from '../hooks/useInView';
import styles from './Reveal.module.css';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'section';
}

export function Reveal({ children, delay = 0, className, as = 'div' }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const Tag = as;

  return (
    <Tag
      ref={ref as never}
      className={clsx(styles.reveal, inView && styles.revealVisible, className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
