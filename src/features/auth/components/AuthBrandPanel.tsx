import { useTranslation } from 'react-i18next';

import { BurkinaFlag } from '../../../shared/ui/BurkinaFlag';
import { AnimatedCounter } from '../../../shared/ui/AnimatedCounter';
import styles from '../pages/AuthPage.module.css';

interface AuthBrandPanelProps {
  textKey?: string;
}

export function AuthBrandPanel({ textKey = 'auth.brandTextLogin' }: AuthBrandPanelProps) {
  const { t } = useTranslation();
  return (
    <div className={styles.brandSide}>
      <div className={styles.brandMesh} aria-hidden="true" />
      <div className={styles.brandPattern} aria-hidden="true" />
      <div className={styles.brandContent}>
        <span className={styles.brandBadge}>{t('common.appName')}</span>
        <h2 className={styles.brandTitle}>
          {t('auth.brandTitleLine1')}
          <br />
          <span className={styles.brandTitleAccent}>{t('auth.brandTitleLine2')}</span>
        </h2>
        <p className={styles.brandText}>{t(textKey)}</p>
      </div>

      <BurkinaFlag className={styles.brandFlag} />

      <div className={styles.brandStats}>
        <div className={styles.brandStat}>
          <span className={styles.brandStatValue}>
            <AnimatedCounter target={1080} />
          </span>
          <span className={styles.brandStatLabel}>{t('auth.brandStatDestinations')}</span>
        </div>
        <div className={styles.brandStat}>
          <span className={styles.brandStatValue}>
            <AnimatedCounter target={17} />
          </span>
          <span className={styles.brandStatLabel}>{t('auth.brandStatRegions')}</span>
        </div>
        <div className={styles.brandStat}>
          <span className={styles.brandStatValue}>
            <AnimatedCounter target={47} />
          </span>
          <span className={styles.brandStatLabel}>{t('auth.brandStatProvinces')}</span>
        </div>
      </div>
    </div>
  );
}
