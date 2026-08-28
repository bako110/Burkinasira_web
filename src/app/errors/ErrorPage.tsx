import { useTranslation } from 'react-i18next';
import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Compass, AlertTriangle, Home } from 'lucide-react';

import styles from './ErrorPage.module.css';

export function ErrorPage() {
  const { t } = useTranslation();
  const error = useRouteError();

  const is404 = !error || (isRouteErrorResponse(error) && error.status === 404);

  return (
    <div className={styles.page}>
      <div className={styles.mesh} aria-hidden="true" />
      <div className={styles.content}>
        <span className={styles.icon}>
          {is404 ? <Compass size={40} strokeWidth={1.5} /> : <AlertTriangle size={40} strokeWidth={1.5} />}
        </span>
        <h1 className={styles.title}>{is404 ? t('errors.notFoundTitle') : t('errors.genericTitle')}</h1>
        <p className={styles.text}>{is404 ? t('errors.notFoundText') : t('errors.genericText')}</p>
        <div className={styles.actions}>
          <Link to="/" className={styles.primaryBtn}>
            <Home size={16} strokeWidth={2} />
            {t('errors.backHome')}
          </Link>
          <Link to="/explore" className={styles.secondaryBtn}>
            {t('nav.explore')}
          </Link>
        </div>
      </div>
    </div>
  );
}
