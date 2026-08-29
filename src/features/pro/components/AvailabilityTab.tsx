import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2 } from 'lucide-react';

import { Button, Modal, Spinner, EmptyResults } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useMyGuideProfile } from '../hooks/useGuideProfile';
import { useCreateAvailabilitySlot, useDeleteAvailabilitySlot, useGuideAvailability } from '../hooks/useAvailability';
import styles from './AvailabilityTab.module.css';

export function AvailabilityTab() {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const { data: profile } = useMyGuideProfile();
  const { data: slots, isLoading } = useGuideAvailability(profile?.id ?? null);
  const createSlot = useCreateAvailabilitySlot();
  const deleteSlot = useDeleteAvailabilitySlot();

  const [modalOpen, setModalOpen] = useState(false);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  function resetAndClose() {
    setDate('');
    setStartTime('');
    setEndTime('');
    setModalOpen(false);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    createSlot.mutate(
      { date, start_time: startTime, end_time: endTime },
      {
        onSuccess: () => {
          push({ variant: 'success', message: t('pro.slotCreated') });
          resetAndClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
      },
    );
  }

  function handleDelete(slotId: string) {
    deleteSlot.mutate(slotId, {
      onSuccess: () => push({ variant: 'success', message: t('pro.slotDeleted') }),
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
    });
  }

  const sortedSlots = [...(slots ?? [])].sort((a, b) => (a.date + a.start_time).localeCompare(b.date + b.start_time));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t('pro.availabilityTitle')}</h3>
        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus size={15} strokeWidth={2} />
          {t('pro.addSlot')}
        </Button>
      </div>

      {isLoading && <Spinner size={22} />}

      {!isLoading && sortedSlots.length === 0 && (
        <EmptyResults variant="empty" title={t('pro.noSlots')} text={t('pro.noSlotsDesc')} />
      )}

      {!isLoading && sortedSlots.length > 0 && (
        <div className={styles.slotList}>
          {sortedSlots.map((slot) => (
            <div key={slot.id} className={styles.slotItem}>
              <div className={styles.slotInfo}>
                <span className={styles.slotDate}>{slot.date}</span>
                <span className={styles.slotTime}>
                  {slot.start_time} - {slot.end_time}
                </span>
              </div>
              <span className={`${styles.badge} ${slot.is_booked ? styles.badgeBooked : styles.badgeAvailable}`}>
                {slot.is_booked ? t('pro.slotBooked') : t('pro.slotAvailable')}
              </span>
              {!slot.is_booked && (
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => handleDelete(slot.id)}
                  disabled={deleteSlot.isPending}
                  aria-label={t('pro.deleteSlot')}
                >
                  <Trash2 size={15} strokeWidth={2} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={resetAndClose} title={t('pro.addSlot')}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="slot_date" className={styles.label}>
              {t('pro.slotDate')}
            </label>
            <input
              id="slot_date"
              type="date"
              className={styles.input}
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="slot_start" className={styles.label}>
                {t('pro.slotStart')}
              </label>
              <input
                id="slot_start"
                type="time"
                className={styles.input}
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="slot_end" className={styles.label}>
                {t('pro.slotEnd')}
              </label>
              <input
                id="slot_end"
                type="time"
                className={styles.input}
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" fullWidth disabled={createSlot.isPending}>
            {createSlot.isPending ? <Spinner size={18} /> : t('pro.saveSlot')}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
