import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Trophy } from 'lucide-react';

import { fetchAwards } from '../../../shared/api/awards.api';
import { Reveal } from '../../../shared/ui/Reveal';
import styles from './SithoAwards.module.css';

export function SithoAwards() {
  const { t } = useTranslation();
  const { data: photos } = useQuery({
    queryKey: ['awards'],
    queryFn: fetchAwards,
    staleTime: 10 * 60 * 1000,
  });

  if (!photos || photos.length === 0) return null;

  // Deux moitiés identiques (boucle sans coupure), chacune assez large pour couvrir l'écran.
  const repeats = Math.max(1, Math.ceil(6 / photos.length));
  const copies = Array.from({ length: repeats * 2 }, (_, i) => i);

  return (
    <section className={styles.section}>
      <Reveal className={styles.inner}>
        <span className={styles.badge}>
          <Trophy size={16} aria-hidden="true" />
          {t('home.awards.badge')}
        </span>
        <h2 className={styles.title}>{t('home.awards.title')}</h2>
        <p className={styles.text}>{t('home.awards.text')}</p>
      </Reveal>
      <div className={styles.marquee}>
        <div className={styles.track}>
          {copies.map((copy) =>
            photos.map((p) => (
              <figure key={`${copy}-${p.id}`} className={styles.card} aria-hidden={copy > 0}>
                <img src={p.url} alt={t('home.awards.alt', { year: p.edition ?? '' })} loading="lazy" />
                {p.edition && <figcaption>SITHO {p.edition}</figcaption>}
              </figure>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
