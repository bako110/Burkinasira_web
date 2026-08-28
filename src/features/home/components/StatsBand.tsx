import { useTranslation } from 'react-i18next';

import { Reveal } from '../../../shared/ui/Reveal';
import { AnimatedCounter } from '../../../shared/ui/AnimatedCounter';
import { FloatingFlags } from '../../../shared/ui';
import styles from './StatsBand.module.css';

const STATS = [
  { key: 'destinations', target: 450, suffix: '+' },
  { key: 'guides', target: 120, suffix: '+' },
  { key: 'provinces', target: 45, suffix: '' },
  { key: 'travelers', target: 12000, suffix: '+' },
] as const;

export function StatsBand() {
  const { t } = useTranslation();

  return (
    <section className={styles.band}>
      <FloatingFlags tone="bold" />
      <div className={styles.grid}>
        {STATS.map((stat, i) => (
          <Reveal key={stat.key} delay={i * 90} className={styles.item}>
            <span className={styles.value}>
              <AnimatedCounter target={stat.target} suffix={stat.suffix} />
            </span>
            <span className={styles.label}>{t(`home.stats.${stat.key}`)}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
