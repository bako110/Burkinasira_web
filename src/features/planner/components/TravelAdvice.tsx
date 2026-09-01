import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileCheck,
  Syringe,
  CalendarRange,
  Wallet,
  ShieldCheck,
  Plug,
  Languages,
  HeartPulse,
  Sun,
  HandHeart,
  Phone,
  Luggage,
  Camera,
  MessageSquareHeart,
  Compass,
  ChevronDown,
} from 'lucide-react';
import clsx from 'clsx';

import { ADVICE_PHASES, adviceByPhase, type AdvicePhase } from '../advice';
import styles from './TravelAdvice.module.css';

const ICONS = {
  FileCheck,
  Syringe,
  CalendarRange,
  Wallet,
  ShieldCheck,
  Plug,
  Languages,
  HeartPulse,
  Sun,
  HandHeart,
  Phone,
  Luggage,
  Camera,
  MessageSquareHeart,
} as const;

interface TravelAdviceProps {
  /** Réduit l'accordéon par défaut (utile en colonne latérale). */
  collapsedByDefault?: boolean;
}

export function TravelAdvice({ collapsedByDefault = false }: TravelAdviceProps) {
  const { t } = useTranslation();
  const [openPhase, setOpenPhase] = useState<AdvicePhase | null>(
    collapsedByDefault ? null : 'before',
  );

  return (
    <section className={styles.wrap} aria-labelledby="advice-title">
      <header className={styles.header}>
        <Compass size={18} strokeWidth={2} />
        <div>
          <h2 id="advice-title" className={styles.title}>
            {t('advice.title')}
          </h2>
          <p className={styles.subtitle}>{t('advice.subtitle')}</p>
        </div>
      </header>

      <div className={styles.timeline}>
        {ADVICE_PHASES.map((phase) => {
          const items = adviceByPhase(phase);
          const isOpen = openPhase === phase;
          return (
            <div key={phase} className={clsx(styles.phase, isOpen && styles.phaseOpen)}>
              <button
                type="button"
                className={styles.phaseHeader}
                onClick={() => setOpenPhase(isOpen ? null : phase)}
                aria-expanded={isOpen}
              >
                <span className={styles.phaseDot} />
                <span className={styles.phaseLabel}>{t(`advice.phases.${phase}`)}</span>
                <span className={styles.phaseCount}>{items.length}</span>
                <ChevronDown size={16} strokeWidth={2} className={styles.phaseChevron} />
              </button>

              {isOpen && (
                <ul className={styles.list}>
                  {items.map((item) => {
                    const Icon = ICONS[item.icon];
                    return (
                      <li key={item.id} className={styles.item}>
                        <span className={styles.itemIcon}>
                          <Icon size={16} strokeWidth={2} />
                        </span>
                        <div>
                          <p className={styles.itemTitle}>{t(`advice.items.${item.id}.title`)}</p>
                          <p className={styles.itemText}>{t(`advice.items.${item.id}.text`)}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <p className={styles.disclaimer}>{t('advice.disclaimer')}</p>
    </section>
  );
}
