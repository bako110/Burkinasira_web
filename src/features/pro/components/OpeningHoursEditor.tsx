import { useTranslation } from 'react-i18next';

import type { OpeningHoursPayload } from '../types';
import styles from './OpeningHoursEditor.module.css';

const DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

interface OpeningHoursEditorProps {
  value: OpeningHoursPayload[];
  onChange: (value: OpeningHoursPayload[]) => void;
}

function rowFor(value: OpeningHoursPayload[], day: string): OpeningHoursPayload {
  return value.find((row) => row.day === day) ?? { day, open_time: '', close_time: '', closed: false };
}

export function OpeningHoursEditor({ value, onChange }: OpeningHoursEditorProps) {
  const { t } = useTranslation();

  function update(day: string, patch: Partial<OpeningHoursPayload>) {
    const existing = rowFor(value, day);
    const updated = { ...existing, ...patch };
    const withoutDay = value.filter((row) => row.day !== day);
    onChange([...withoutDay, updated].sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day)));
  }

  return (
    <div className={styles.container}>
      <span className={styles.title}>{t('pro.openingHours')}</span>
      {DAYS.map((day) => {
        const row = rowFor(value, day);
        return (
          <div key={day} className={styles.dayRow}>
            <span className={styles.dayLabel}>{t(`pro.days.${day}`)}</span>
            {row.closed ? (
              <span className={styles.closedTag}>{t('pro.closed')}</span>
            ) : (
              <div className={styles.times}>
                <input
                  type="time"
                  className={styles.timeInput}
                  value={row.open_time ?? ''}
                  onChange={(e) => update(day, { open_time: e.target.value })}
                />
                <span className={styles.dash}>–</span>
                <input
                  type="time"
                  className={styles.timeInput}
                  value={row.close_time ?? ''}
                  onChange={(e) => update(day, { close_time: e.target.value })}
                />
              </div>
            )}
            <label className={styles.closedToggle}>
              <input
                type="checkbox"
                checked={row.closed}
                onChange={(e) => update(day, { closed: e.target.checked })}
              />
              {t('pro.closedToday')}
            </label>
          </div>
        );
      })}
    </div>
  );
}
