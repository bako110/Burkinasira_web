import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Compass } from 'lucide-react';

import type { FirstVisitGuideCategory } from '../types';
import styles from './FirstVisitHero.module.css';

interface HeroChip {
  key: FirstVisitGuideCategory;
  Icon: ComponentType<{ size?: number; strokeWidth?: number }>;
}

interface FirstVisitHeroProps {
  chips: HeroChip[];
}

/**
 * Hero éditorial dédié au guide de première visite : dégradé savane + mesh,
 * badge, titre magazine et raccourcis vers les grandes sections du guide.
 */
export function FirstVisitHero({ chips }: FirstVisitHeroProps) {
  const { t } = useTranslation();

  return (
    <section className={styles.hero}>
      <div className={styles.mesh} aria-hidden="true" />
      <div className={styles.pattern} aria-hidden="true" />

      <div className={styles.content}>
        <span className={styles.badge}>
          <Compass size={13} strokeWidth={2} aria-hidden="true" />
          {t('international.kicker')}
        </span>

        <h1 className={styles.title}>{t('international.title')}</h1>
        <p className={styles.subtitle}>{t('international.subtitle')}</p>

        {chips.length > 0 && (
          <nav className={styles.chips} aria-label={t('international.title')}>
            {chips.map(({ key, Icon }) => (
              <a key={key} href={`#guide-${key}`} className={styles.chip}>
                <Icon size={14} strokeWidth={2} />
                {t(`international.categories.${key}`)}
              </a>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
