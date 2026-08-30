import { useTranslation } from 'react-i18next';
import { MapPin, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

import { BURKINA_REGION_NAMES, getProvincesForRegion } from '../data/burkinaRegions';
import styles from './RegionProvinceFilter.module.css';

interface RegionProvinceFilterProps {
  region: string | undefined;
  province?: string | undefined;
  onRegionChange: (region: string | undefined) => void;
  onProvinceChange?: (province: string | undefined) => void;
  /** Masque le second sélecteur (province) quand le module ne le supporte pas côté backend. */
  showProvince?: boolean;
}

export function RegionProvinceFilter({
  region,
  province,
  onRegionChange,
  onProvinceChange,
  showProvince = false,
}: RegionProvinceFilterProps) {
  const { t } = useTranslation();
  const provinces = getProvincesForRegion(region);

  function handleRegionChange(value: string) {
    onRegionChange(value || undefined);
    onProvinceChange?.(undefined);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.selectField}>
        <MapPin size={15} strokeWidth={2} className={styles.icon} />
        <select
          className={clsx(styles.select, styles.selectWithIcon)}
          value={region ?? ''}
          onChange={(e) => handleRegionChange(e.target.value)}
          aria-label={t('common.regionFilter')}
        >
          <option value="">{t('common.allRegions')}</option>
          {BURKINA_REGION_NAMES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <ChevronDown size={14} strokeWidth={2} className={styles.chevron} />
      </div>

      {showProvince && (
        <div className={styles.selectField}>
          <select
            className={styles.select}
            value={province ?? ''}
            onChange={(e) => onProvinceChange?.(e.target.value || undefined)}
            disabled={!region}
            aria-label={t('common.provinceFilter')}
          >
            <option value="">{t('common.allProvinces')}</option>
            {provinces.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <ChevronDown size={14} strokeWidth={2} className={styles.chevron} />
        </div>
      )}
    </div>
  );
}
