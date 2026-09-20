import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { DISCOVER_LINKS, PRACTICAL_LINKS } from './DiscoverMenu';
import styles from './Footer.module.css';

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          <div className={styles.brandCol}>
            <NavLink to="/" className={styles.brand}>
              <img src="/logo.png" alt="" className={styles.logo} />
              <span>{t('common.appName')}</span>
            </NavLink>
            <p className={styles.tagline}>{t('footer.tagline')}</p>
          </div>

          <div className={styles.linkCol}>
            <span className={styles.colTitle}>{t('footer.discoverTitle')}</span>
            <nav className={styles.linkList}>
              {DISCOVER_LINKS.map(({ to, key }) => (
                <NavLink key={key} to={to} className={styles.link}>
                  {t(`nav.${key}`)}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className={styles.linkCol}>
            <span className={styles.colTitle}>{t('footer.practicalTitle')}</span>
            <nav className={styles.linkList}>
              {PRACTICAL_LINKS.map(({ to, key }) => (
                <NavLink key={key} to={to} className={styles.link}>
                  {t(`nav.${key}`)}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className={styles.linkCol}>
            <span className={styles.colTitle}>{t('footer.legalTitle')}</span>
            <nav className={styles.linkList}>
              <NavLink to="/privacy" className={styles.link}>
                {t('footer.privacy')}
              </NavLink>
              <NavLink to="/terms" className={styles.link}>
                {t('footer.terms')}
              </NavLink>
            </nav>
          </div>
        </div>

        <div className={styles.bottom}>
          <span className={styles.copyright}>
            © {year} {t('common.appName')} — {t('footer.rights')}
          </span>
        </div>
      </div>
    </footer>
  );
}
