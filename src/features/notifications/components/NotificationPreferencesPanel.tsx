import { useTranslation } from 'react-i18next';

import { Spinner } from '../../../shared/ui';
import { useNotificationPreferences, useUpdateNotificationPreferences } from '../hooks/useNotificationPreferences';
import { ALL_NOTIFICATION_CATEGORIES, type NotificationCategory } from '../types';
import styles from './NotificationPreferencesPanel.module.css';

export function NotificationPreferencesPanel() {
  const { t } = useTranslation();
  const { data: prefs, isLoading } = useNotificationPreferences();
  const { mutate: updatePrefs } = useUpdateNotificationPreferences();

  if (isLoading || !prefs) {
    return (
      <div className={styles.center}>
        <Spinner size={22} />
      </div>
    );
  }

  function toggleCategory(category: NotificationCategory) {
    if (!prefs) return;
    const enabled = prefs.enabled_categories.includes(category);
    const next = enabled
      ? prefs.enabled_categories.filter((c) => c !== category)
      : [...prefs.enabled_categories, category];
    updatePrefs({ enabled_categories: next });
  }

  return (
    <div className={styles.panel}>
      <div className={styles.toggleRow}>
        <span className={styles.toggleLabel}>{t('notifications.pushEnabled')}</span>
        <button
          type="button"
          className={styles.switch}
          data-on={prefs.push_enabled}
          role="switch"
          aria-checked={prefs.push_enabled}
          onClick={() => updatePrefs({ push_enabled: !prefs.push_enabled })}
        >
          <span className={styles.switchThumb} />
        </button>
      </div>

      <div className={styles.toggleRow}>
        <span className={styles.toggleLabel}>{t('notifications.inAppEnabled')}</span>
        <button
          type="button"
          className={styles.switch}
          data-on={prefs.in_app_enabled}
          role="switch"
          aria-checked={prefs.in_app_enabled}
          onClick={() => updatePrefs({ in_app_enabled: !prefs.in_app_enabled })}
        >
          <span className={styles.switchThumb} />
        </button>
      </div>

      <div className={styles.divider} />

      <span className={styles.categoriesLabel}>{t('notifications.categoriesLabel')}</span>
      {ALL_NOTIFICATION_CATEGORIES.map((category) => {
        const enabled = prefs.enabled_categories.includes(category);
        return (
          <div key={category} className={styles.toggleRow}>
            <span className={styles.toggleLabel}>{t(`notifications.categories.${category}`)}</span>
            <button
              type="button"
              className={styles.switch}
              data-on={enabled}
              role="switch"
              aria-checked={enabled}
              onClick={() => toggleCategory(category)}
            >
              <span className={styles.switchThumb} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
