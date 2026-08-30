import { useTranslation } from 'react-i18next';
import { Plus, Trash2 } from 'lucide-react';

import type { MenuItemPayload } from '../types';
import styles from './RoomTypesEditor.module.css';

interface MenuEditorProps {
  value: MenuItemPayload[];
  onChange: (value: MenuItemPayload[]) => void;
}

function emptyMenuItem(): MenuItemPayload {
  return { name: '', description: '', price: undefined, currency: 'XOF', is_specialty: false };
}

export function MenuEditor({ value, onChange }: MenuEditorProps) {
  const { t } = useTranslation();

  function update(index: number, patch: Partial<MenuItemPayload>) {
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...value, emptyMenuItem()]);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>{t('pro.menu')}</span>
        <button type="button" className={styles.addButton} onClick={add}>
          <Plus size={14} strokeWidth={2} />
          {t('pro.addMenuItem')}
        </button>
      </div>

      {value.length === 0 && <p className={styles.emptyHint}>{t('pro.noMenuItems')}</p>}

      {value.map((item, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.cardHeader}>
            <input
              type="text"
              className={styles.nameInput}
              placeholder={t('pro.menuItemNamePlaceholder')}
              value={item.name}
              onChange={(e) => update(index, { name: e.target.value })}
            />
            <button type="button" className={styles.removeButton} onClick={() => remove(index)} aria-label={t('pro.remove')}>
              <Trash2 size={16} strokeWidth={2} />
            </button>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{t('pro.description')}</label>
            <input
              type="text"
              className={styles.input}
              value={item.description ?? ''}
              onChange={(e) => update(index, { description: e.target.value })}
            />
          </div>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>{t('pro.price')}</label>
              <input
                type="number"
                min={0}
                step="any"
                className={styles.input}
                value={item.price ?? ''}
                onChange={(e) => update(index, { price: e.target.value ? Number(e.target.value) : undefined })}
              />
            </div>
            <label className={styles.checkboxField}>
              <input
                type="checkbox"
                checked={item.is_specialty}
                onChange={(e) => update(index, { is_specialty: e.target.checked })}
              />
              {t('pro.isSpecialty')}
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
