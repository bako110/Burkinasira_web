import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BedDouble, UtensilsCrossed, Bus, ShoppingBasket, Compass, PartyPopper, ArrowRight } from 'lucide-react';

import { Reveal } from '../../../shared/ui/Reveal';
import { FloatingFlags } from '../../../shared/ui';
import styles from './CategoryShowcase.module.css';

const CATEGORIES = [
  { key: 'stay', to: '/hotels', Icon: BedDouble, tone: 'tone1' },
  { key: 'food', to: '/restaurants', Icon: UtensilsCrossed, tone: 'tone2' },
  { key: 'mobility', to: '/mobility', Icon: Bus, tone: 'tone3' },
  { key: 'market', to: '/explore?category=marche_artisanal', Icon: ShoppingBasket, tone: 'tone4' },
  { key: 'guides', to: '/guides', Icon: Compass, tone: 'tone1' },
  { key: 'events', to: '/events', Icon: PartyPopper, tone: 'tone2' },
] as const;

export function CategoryShowcase() {
  const { t } = useTranslation();

  return (
    <section className={styles.section}>
      <FloatingFlags tone="subtle" />
      <Reveal>
        <h2 className={styles.heading}>{t('home.categoriesTitle')}</h2>
        <p className={styles.subheading}>{t('home.categoriesSubtitle')}</p>
      </Reveal>

      <div className={styles.grid}>
        {CATEGORIES.map((cat, i) => (
          <Reveal key={cat.key} delay={i * 70}>
            <Link to={cat.to} className={styles.card} data-tone={cat.tone}>
              <span className={styles.iconWrap}>
                <cat.Icon size={22} strokeWidth={1.75} className={styles.icon} />
              </span>
              <span className={styles.cardTitle}>{t(`home.categories.${cat.key}.title`)}</span>
              <span className={styles.cardText}>{t(`home.categories.${cat.key}.text`)}</span>
              <ArrowRight size={16} strokeWidth={2} className={styles.arrow} aria-hidden="true" />
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
