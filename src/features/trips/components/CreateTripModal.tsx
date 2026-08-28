import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import { Modal, Button, Input, Spinner } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useCreateTrip } from '../hooks/useCreateTrip';
import type { TripThemeType } from '../types';
import styles from './CreateTripModal.module.css';

const THEMES: TripThemeType[] = [
  'budget',
  'duree',
  'region',
  'culturel',
  'nature',
  'familial',
  'gastronomique',
  'affaires',
];

interface CreateTripModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateTripModal({ open, onClose }: CreateTripModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const push = useToastStore((s) => s.push);
  const { mutate, isPending, error } = useCreateTrip();

  const [title, setTitle] = useState('');
  const [region, setRegion] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [themes, setThemes] = useState<TripThemeType[]>([]);

  function toggleTheme(theme: TripThemeType) {
    setThemes((prev) => (prev.includes(theme) ? prev.filter((t2) => t2 !== theme) : [...prev, theme]));
  }

  function resetAndClose() {
    setTitle('');
    setRegion('');
    setStartDate('');
    setEndDate('');
    setBudget('');
    setThemes([]);
    onClose();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutate(
      {
        title,
        themes,
        region: region || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        budget_estimate: budget ? Number(budget) : undefined,
      },
      {
        onSuccess: (trip) => {
          push({ variant: 'success', message: t('trips.createSuccess') });
          resetAndClose();
          navigate(`/trips/${trip.id}`);
        },
        onError: (err) => {
          push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) });
        },
      },
    );
  }

  return (
    <Modal open={open} onClose={resetAndClose} title={t('trips.createTitle')}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          label={t('trips.titleLabel')}
          name="trip-title"
          required
          minLength={2}
          maxLength={150}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Input
          label={t('trips.regionLabel')}
          name="trip-region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />

        <div className={styles.dateRow}>
          <Input
            label={t('trips.startDate')}
            name="trip-start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label={t('trips.endDate')}
            name="trip-end"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <Input
          label={t('trips.budgetLabel')}
          name="trip-budget"
          type="number"
          min={0}
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="XOF"
        />

        <div className={styles.field}>
          <span className={styles.label}>{t('trips.themesLabel')}</span>
          <div className={styles.themeGrid}>
            {THEMES.map((theme) => (
              <button
                key={theme}
                type="button"
                className={clsx(styles.themeChip, themes.includes(theme) && styles.themeChipActive)}
                onClick={() => toggleTheme(theme)}
                aria-pressed={themes.includes(theme)}
              >
                {t(`trips.themes.${theme}`)}
              </button>
            ))}
          </div>
        </div>

        {error && <p className={styles.errorText}>{extractApiErrorMessage(error, t('common.error'))}</p>}

        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? <Spinner size={18} /> : t('trips.createCta')}
        </Button>
      </form>
    </Modal>
  );
}
