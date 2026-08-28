import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal, Button, Input, Spinner } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useAddTripDayItem } from '../hooks/useTripDayItems';
import type { TripItemType } from '../types';
import styles from './AddDayItemModal.module.css';

const ITEM_TYPES: TripItemType[] = [
  'destination',
  'hotel',
  'restaurant',
  'experience',
  'event',
  'guide',
  'transport',
  'autre',
];

interface AddDayItemModalProps {
  tripId: string;
  date: string | null;
  onClose: () => void;
}

export function AddDayItemModal({ tripId, date, onClose }: AddDayItemModalProps) {
  const { t, i18n } = useTranslation();
  const push = useToastStore((s) => s.push);
  const { mutate, isPending, error } = useAddTripDayItem(tripId);

  const [time, setTime] = useState('');
  const [type, setType] = useState<TripItemType>('destination');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [cost, setCost] = useState('');

  function resetAndClose() {
    setTime('');
    setType('destination');
    setTitle('');
    setNotes('');
    setCost('');
    onClose();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!date) return;
    mutate(
      {
        date,
        item: {
          time: time || undefined,
          type,
          title,
          notes: notes || undefined,
          estimated_cost: cost ? Number(cost) : undefined,
        },
      },
      {
        onSuccess: () => {
          push({ variant: 'success', message: t('trips.itemAdded') });
          resetAndClose();
        },
        onError: (err) => {
          push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) });
        },
      },
    );
  }

  const formattedDate = date
    ? new Date(date).toLocaleDateString(i18n.language, { weekday: 'long', day: '2-digit', month: 'long' })
    : '';

  return (
    <Modal open={Boolean(date)} onClose={resetAndClose} title={t('trips.addItemTitle', { date: formattedDate })}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <span className={styles.label}>{t('trips.itemType')}</span>
          <select className={styles.select} value={type} onChange={(e) => setType(e.target.value as TripItemType)}>
            {ITEM_TYPES.map((it) => (
              <option key={it} value={it}>
                {t(`trips.itemTypes.${it}`)}
              </option>
            ))}
          </select>
        </div>

        <Input
          label={t('trips.itemTitle')}
          name="item-title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className={styles.row}>
          <Input label={t('trips.itemTime')} name="item-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          <Input
            label={t('trips.itemCost')}
            name="item-cost"
            type="number"
            min={0}
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="item-notes" className={styles.label}>
            {t('trips.itemNotes')}
          </label>
          <textarea
            id="item-notes"
            className={styles.textarea}
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {error && <p className={styles.errorText}>{extractApiErrorMessage(error, t('common.error'))}</p>}

        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? <Spinner size={18} /> : t('trips.addItemCta')}
        </Button>
      </form>
    </Modal>
  );
}
