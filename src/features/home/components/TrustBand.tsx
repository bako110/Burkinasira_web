import { useTranslation } from 'react-i18next';
import { ShieldCheck, BadgeCheck, Landmark, HeartHandshake } from 'lucide-react';

import { Reveal } from '../../../shared/ui/Reveal';
import styles from './TrustBand.module.css';

const ITEMS = [
  { key: 'verified', Icon: BadgeCheck },
  { key: 'official', Icon: Landmark },
  { key: 'secure', Icon: ShieldCheck },
  { key: 'community', Icon: HeartHandshake },
] as const;

export function TrustBand() {
  const { t } = useTranslation();

  return (
    <section className={styles.band}>
      <div className={styles.inner}>
        {ITEMS.map(({ key, Icon }, i) => (
          <Reveal key={key} delay={i * 60} className={styles.item}>
            <span className={styles.iconWrap}>
              <Icon size={16} strokeWidth={2} className={styles.icon} />
            </span>
            <span>{t(`home.trust.${key}`)}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
