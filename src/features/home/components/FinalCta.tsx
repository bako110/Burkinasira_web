import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Reveal } from '../../../shared/ui/Reveal';
import { FloatingFlags } from '../../../shared/ui';
import { useAuthStore } from '../../../store/auth.store';
import styles from './FinalCta.module.css';

export function FinalCta() {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <section className={styles.section}>
      <Reveal className={styles.card}>
        <div className={styles.glow} aria-hidden="true" />
        <FloatingFlags tone="bold" />
        <h2 className={styles.title}>{t('home.ctaTitle')}</h2>
        <p className={styles.text}>{t('home.ctaText')}</p>
        <div className={styles.actions}>
          <Link to="/explore" className={styles.primaryBtn}>
            {t('nav.explore')}
          </Link>
          {!isAuthenticated && (
            <Link to="/register" className={styles.secondaryBtn}>
              {t('auth.registerCta')}
            </Link>
          )}
        </div>
      </Reveal>
    </section>
  );
}
