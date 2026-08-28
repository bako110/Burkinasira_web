import { useTranslation } from 'react-i18next';
import { ShieldCheck, BadgeCheck, Landmark, HeartHandshake } from 'lucide-react';

import { FloatingFlags } from '../../../shared/ui';
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
      <FloatingFlags tone="subtle" />
      <div className={styles.inner}>
        {ITEMS.map(({ key, Icon }) => (
          <div key={key} className={styles.item}>
            <Icon size={18} strokeWidth={2} className={styles.icon} />
            <span>{t(`home.trust.${key}`)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
