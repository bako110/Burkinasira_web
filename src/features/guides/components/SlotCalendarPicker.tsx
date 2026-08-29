import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { AvailabilitySlot } from '../types';
import { computeSlotDurationHours, formatDurationHours } from '../utils/slotDuration';
import styles from './SlotCalendarPicker.module.css';

interface SlotCalendarPickerProps {
  slots: AvailabilitySlot[];
  selectedSlotId: string | null;
  onSelectSlot: (slot: AvailabilitySlot) => void;
}

function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function SlotCalendarPicker({ slots, selectedSlotId, onSelectSlot }: SlotCalendarPickerProps) {
  const { t, i18n } = useTranslation();

  const slotsByDate = useMemo(() => {
    const map = new Map<string, AvailabilitySlot[]>();
    for (const slot of slots) {
      const list = map.get(slot.date) ?? [];
      list.push(slot);
      map.set(slot.date, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.start_time.localeCompare(b.start_time));
    }
    return map;
  }, [slots]);

  const availableDates = useMemo(() => [...slotsByDate.keys()].sort(), [slotsByDate]);

  const initialMonth = useMemo(() => {
    if (availableDates.length === 0) return new Date();
    return new Date(availableDates[0] + 'T00:00:00');
  }, [availableDates]);

  const [viewDate, setViewDate] = useState(initialMonth);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    selectedSlotId ? slots.find((s) => s.id === selectedSlotId)?.date ?? null : null,
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthLabel = viewDate.toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' });

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = (firstDayOfMonth.getDay() + 6) % 7; // lundi = 0

  const todayKey = toDateKey(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  const cells: Array<{ day: number; dateKey: string } | null> = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, dateKey: toDateKey(year, month, day) });
  }

  const slotsForSelectedDate = selectedDate ? slotsByDate.get(selectedDate) ?? [] : [];

  function goToMonth(offset: number) {
    setViewDate(new Date(year, month + offset, 1));
  }

  return (
    <div className={styles.container}>
      <div className={styles.calendarHeader}>
        <button type="button" className={styles.navBtn} onClick={() => goToMonth(-1)} aria-label={t('common.previous')}>
          <ChevronLeft size={16} strokeWidth={2} />
        </button>
        <span className={styles.monthLabel}>{monthLabel}</span>
        <button type="button" className={styles.navBtn} onClick={() => goToMonth(1)} aria-label={t('common.next')}>
          <ChevronRight size={16} strokeWidth={2} />
        </button>
      </div>

      <div className={styles.weekdays}>
        {t('bookings.weekdaysShort', { returnObjects: true }) instanceof Array
          ? (t('bookings.weekdaysShort', { returnObjects: true }) as string[]).map((w) => (
              <span key={w} className={styles.weekday}>
                {w}
              </span>
            ))
          : null}
      </div>

      <div className={styles.grid}>
        {cells.map((cell, i) => {
          if (!cell) return <span key={`empty-${i}`} className={styles.emptyCell} />;
          const hasSlots = slotsByDate.has(cell.dateKey);
          const isPast = cell.dateKey < todayKey;
          const isSelected = cell.dateKey === selectedDate;
          return (
            <button
              key={cell.dateKey}
              type="button"
              className={`${styles.dayCell} ${hasSlots && !isPast ? styles.dayCellAvailable : ''} ${isSelected ? styles.dayCellSelected : ''}`}
              disabled={!hasSlots || isPast}
              onClick={() => setSelectedDate(cell.dateKey)}
            >
              {cell.day}
            </button>
          );
        })}
      </div>

      {availableDates.length === 0 && <p className={styles.noDates}>{t('guides.noSlotsAvailable')}</p>}

      {selectedDate && (
        <div className={styles.slotsForDate}>
          <p className={styles.slotsForDateTitle}>{t('bookings.slotsOn', { date: selectedDate })}</p>
          {slotsForSelectedDate.length === 0 ? (
            <p className={styles.noDates}>{t('guides.noSlotsAvailable')}</p>
          ) : (
            <div className={styles.slotOptions}>
              {slotsForSelectedDate.map((slot) => {
                const duration = computeSlotDurationHours(slot.start_time, slot.end_time);
                return (
                  <button
                    key={slot.id}
                    type="button"
                    className={`${styles.slotOption} ${selectedSlotId === slot.id ? styles.slotOptionSelected : ''}`}
                    onClick={() => onSelectSlot(slot)}
                  >
                    <span className={styles.slotTime}>
                      {slot.start_time} - {slot.end_time}
                    </span>
                    <span className={styles.slotDuration}>{formatDurationHours(duration)}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
