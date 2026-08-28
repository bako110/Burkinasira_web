import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BurkinaFlag } from '../../../shared/ui';
import styles from './WelcomeBanner.module.css';

const SEEN_KEY = 'gotours:welcome-banner-seen';

function alreadySeen() {
  return typeof window !== 'undefined' && sessionStorage.getItem(SEEN_KEY) === '1';
}

export function WelcomeBanner() {
  const { t } = useTranslation();
  const [shouldRender] = useState(() => !alreadySeen());
  const [phase, setPhase] = useState<'hidden' | 'visible' | 'leaving'>('hidden');

  useEffect(() => {
    if (!shouldRender) return;

    sessionStorage.setItem(SEEN_KEY, '1');

    const showTimer = setTimeout(() => setPhase('visible'), 300);
    const leaveTimer = setTimeout(() => setPhase('leaving'), 4300);
    const doneTimer = setTimeout(() => setPhase('hidden'), 5100);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
    };
  }, [shouldRender]);

  if (!shouldRender || phase === 'hidden') return null;

  return (
    <div className={styles.banner} data-phase={phase} role="status">
      <div className={styles.track}>
        <BurkinaFlag className={styles.flagIcon} />
        <span className={styles.text}>{t('home.welcomeBanner')}</span>
        <BurkinaFlag className={styles.flagIcon} />
      </div>
    </div>
  );
}
