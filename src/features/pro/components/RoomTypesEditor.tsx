import { useTranslation } from 'react-i18next';
import { Plus, Trash2 } from 'lucide-react';

import type { RoomTypePayload } from '../types';
import styles from './RoomTypesEditor.module.css';

interface RoomTypesEditorProps {
  value: RoomTypePayload[];
  onChange: (value: RoomTypePayload[]) => void;
}

function emptyRoomType(): RoomTypePayload {
  return { name: '', capacity: 2, price_per_night: 0, currency: 'XOF', total_rooms: 1, amenities: [] };
}

export function RoomTypesEditor({ value, onChange }: RoomTypesEditorProps) {
  const { t } = useTranslation();

  function update(index: number, patch: Partial<RoomTypePayload>) {
    onChange(value.map((room, i) => (i === index ? { ...room, ...patch } : room)));
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...value, emptyRoomType()]);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>{t('pro.roomTypes')}</span>
        <button type="button" className={styles.addButton} onClick={add}>
          <Plus size={14} strokeWidth={2} />
          {t('pro.addRoomType')}
        </button>
      </div>

      {value.length === 0 && <p className={styles.emptyHint}>{t('pro.noRoomTypes')}</p>}

      {value.map((room, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.cardHeader}>
            <input
              type="text"
              className={styles.nameInput}
              placeholder={t('pro.roomTypeNamePlaceholder')}
              value={room.name}
              onChange={(e) => update(index, { name: e.target.value })}
            />
            <button type="button" className={styles.removeButton} onClick={() => remove(index)} aria-label={t('pro.remove')}>
              <Trash2 size={16} strokeWidth={2} />
            </button>
          </div>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>{t('pro.capacity')}</label>
              <input
                type="number"
                min={1}
                className={styles.input}
                value={room.capacity}
                onChange={(e) => update(index, { capacity: Number(e.target.value) || 1 })}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{t('pro.totalRooms')}</label>
              <input
                type="number"
                min={1}
                className={styles.input}
                value={room.total_rooms}
                onChange={(e) => update(index, { total_rooms: Number(e.target.value) || 1 })}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{t('pro.pricePerNight')}</label>
              <input
                type="number"
                min={0}
                step="any"
                className={styles.input}
                value={room.price_per_night}
                onChange={(e) => update(index, { price_per_night: Number(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{t('pro.roomAmenities')}</label>
            <input
              type="text"
              className={styles.input}
              placeholder={t('pro.amenitiesPlaceholder')}
              value={room.amenities.join(', ')}
              onChange={(e) =>
                update(index, { amenities: e.target.value.split(',').map((a) => a.trim()).filter(Boolean) })
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}
