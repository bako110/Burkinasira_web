import { useTranslation } from 'react-i18next';
import { Handshake } from 'lucide-react';

import { Reveal } from '../../../shared/ui/Reveal';
import styles from './Partners.module.css';

// Ajouter un logo : déposer le fichier dans public/partners/ puis renseigner `logo`.
const PARTNERS = [
  { name: 'Gofolyx', logo: 'gofolyx.webp' },
  { name: 'BF1', logo: 'bf1.webp' },
  { name: 'Azalaï Hotel', logo: undefined },
  { name: 'Dunia Hotel', logo: undefined },
] as const;

export function Partners() {
  const { t } = useTranslation();

  return (
    <section className={styles.section}>
      <Reveal className={styles.inner}>
        <span className={styles.badge}>
          <Handshake size={16} aria-hidden="true" />
          {t('home.partners.badge')}
        </span>
        <h2 className={styles.title}>{t('home.partners.title')}</h2>
        <ul className={styles.list}>
          {PARTNERS.map((p) => (
            <li key={p.name} className={styles.item}>
              {p.logo ? (
                <img
                  src={`${import.meta.env.BASE_URL}partners/${p.logo}`}
                  alt={p.name}
                  loading="lazy"
                />
              ) : (
                <span className={styles.name}>{p.name}</span>
              )}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
