import { useTranslation } from 'react-i18next';
import { ShieldCheck, MapPinned, LayoutGrid, Lock } from 'lucide-react';

import { Reveal } from '../../../shared/ui/Reveal';
import styles from './WhyBurkinaSira.module.css';

const REASONS = [
  { key: 'verified', Icon: ShieldCheck },
  { key: 'local', Icon: MapPinned },
  { key: 'allInOne', Icon: LayoutGrid },
  { key: 'secure', Icon: Lock },
] as const;

export function WhyBurkinaSira() {
  const { t } = useTranslation();

  return (
    <section className={styles.section}>
      <div className={styles.layout}>
        <Reveal className={styles.intro}>
          <span className={styles.kicker}>{t('home.badge')}</span>
          <h2 className={styles.heading}>{t('home.whyTitle')}</h2>
          <p className={styles.subheading}>{t('home.whySubtitle')}</p>
        </Reveal>

        <div className={styles.grid}>
          {REASONS.map(({ key, Icon }, i) => (
            <Reveal key={key} delay={i * 90} className={styles.item}>
              <span className={styles.bullet}>
                <Icon size={20} strokeWidth={2} />
              </span>
              <div>
                <h3 className={styles.itemTitle}>{t(`home.why.${key}.title`)}</h3>
                <p className={styles.itemText}>{t(`home.why.${key}.text`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
