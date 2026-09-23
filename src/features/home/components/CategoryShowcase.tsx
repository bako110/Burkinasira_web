import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BedDouble, UtensilsCrossed, Bus, ShoppingBasket, Compass, PartyPopper, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

import { Reveal } from '../../../shared/ui/Reveal';
import styles from './CategoryShowcase.module.css';

const CATEGORIES = [
  { key: 'stay', to: '/hotels', Icon: BedDouble, tone: 'tone1', size: 'large' },
  { key: 'food', to: '/restaurants', Icon: UtensilsCrossed, tone: 'tone2', size: 'small' },
  { key: 'mobility', to: '/mobility', Icon: Bus, tone: 'tone3', size: 'small' },
  { key: 'guides', to: '/guides', Icon: Compass, tone: 'tone1', size: 'medium' },
  { key: 'events', to: '/events', Icon: PartyPopper, tone: 'tone2', size: 'small' },
  { key: 'market', to: '/explore?category=marche_artisanal', Icon: ShoppingBasket, tone: 'tone4', size: 'small' },
] as const;

const ICON_SIZE: Record<(typeof CATEGORIES)[number]['size'], number> = {
  large: 34,
  medium: 26,
  small: 22,
};

export function CategoryShowcase() {
  const { t } = useTranslation();

  return (
    <section className={styles.section}>
      <div className={styles.headingRow}>
        <Reveal className={styles.headingCol}>
          <span className={styles.kicker}>{t('home.badge')}</span>
          <h2 className={styles.heading}>{t('home.categoriesTitle')}</h2>
        </Reveal>
        <Reveal delay={80} className={styles.subheadingCol}>
          <p className={styles.subheading}>{t('home.categoriesSubtitle')}</p>
        </Reveal>
      </div>

      <div className={styles.grid}>
        {CATEGORIES.map((cat, i) => (
          <Reveal
            key={cat.key}
            delay={i * 70}
            className={clsx(styles.cardOuter, styles[`size-${cat.size}`])}
          >
            <Link to={cat.to} className={styles.card} data-tone={cat.tone}>
              <span className={styles.iconWrap}>
                <cat.Icon size={ICON_SIZE[cat.size]} strokeWidth={1.75} className={styles.icon} />
              </span>
              <span className={styles.cardBody}>
                <span className={styles.cardTitle}>{t(`home.categories.${cat.key}.title`)}</span>
                <span className={styles.cardText}>{t(`home.categories.${cat.key}.text`)}</span>
              </span>
              <ArrowRight size={16} strokeWidth={2} className={styles.arrow} aria-hidden="true" />
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
